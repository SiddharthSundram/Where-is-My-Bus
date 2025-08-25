import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/analytics - Get comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const city = searchParams.get("city");

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(period));

    // Get basic counts
    const [
      totalUsers,
      totalBuses,
      totalRoutes,
      totalBookings,
      activeBookings,
      totalRevenue
    ] = await Promise.all([
      db.user.count(),
      db.bus.count({ where: { status: "ACTIVE" } }),
      db.route.count(),
      db.booking.count({
        where: {
          createdAt: {
            gte: fromDate
          }
        }
      }),
      db.booking.count({
        where: {
          status: "PAID",
          createdAt: {
            gte: fromDate
          }
        }
      }),
      db.payment.aggregate({
        where: {
          status: "success",
          createdAt: {
            gte: fromDate
          }
        },
        _sum: {
          amount: true
        }
      })
    ]);

    // Get booking trends (daily)
    const bookingTrends = await db.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as bookings,
        SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) as paidBookings
      FROM bookings 
      WHERE createdAt >= ${fromDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; bookings: number; paidBookings: number }>;

    // Get revenue trends (daily)
    const revenueTrends = await db.$queryRaw`
      SELECT 
        DATE(p.createdAt) as date,
        SUM(p.amount) as revenue,
        COUNT(*) as transactions
      FROM payments p
      JOIN bookings b ON p.bookingId = b.id
      WHERE p.status = 'success' AND p.createdAt >= ${fromDate}
      GROUP BY DATE(p.createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; revenue: number; transactions: number }>;

    // Get popular routes
    const popularRoutes = await db.$queryRaw`
      SELECT 
        r.id,
        r.name,
        r.city,
        COUNT(b.id) as bookingCount,
        SUM(p.amount) as revenue
      FROM routes r
      LEFT JOIN bookings b ON r.id = b.routeId
      LEFT JOIN payments p ON b.id = p.bookingId AND p.status = 'success'
      WHERE b.createdAt >= ${fromDate}
      GROUP BY r.id, r.name, r.city
      ORDER BY bookingCount DESC
      LIMIT 10
    ` as Array<{ id: string; name: string; city: string; bookingCount: number; revenue: number }>;

    // Get bus performance metrics
    const busPerformance = await db.$queryRaw`
      SELECT 
        b.id,
        b.busNumber,
        b.operator,
        b.type,
        b.capacity,
        COUNT(booking.id) as totalBookings,
        AVG(t.delayMin) as avgDelay,
        MAX(t.timestamp) as lastSeen
      FROM buses b
      LEFT JOIN bookings booking ON b.id = booking.busId AND booking.createdAt >= ${fromDate}
      LEFT JOIN telemetry t ON b.id = t.busId
      WHERE b.status = 'ACTIVE'
      GROUP BY b.id, b.busNumber, b.operator, b.type, b.capacity
      ORDER BY totalBookings DESC
      LIMIT 20
    ` as Array<{
      id: string;
      busNumber: string;
      operator: string;
      type: string;
      capacity: number;
      totalBookings: number;
      avgDelay: number | null;
      lastSeen: Date | null;
    }>;

    // Get user activity metrics
    const userActivity = await db.$queryRaw`
      SELECT 
        DATE(u.createdAt) as date,
        COUNT(*) as newUsers
      FROM users u
      WHERE u.createdAt >= ${fromDate}
      GROUP BY DATE(u.createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; newUsers: number }>;

    // Get payment method distribution
    const paymentMethods = await db.$queryRaw`
      SELECT 
        provider,
        COUNT(*) as count,
        SUM(amount) as totalAmount,
        AVG(amount) as averageAmount
      FROM payments
      WHERE status = 'success' AND createdAt >= ${fromDate}
      GROUP BY provider
      ORDER BY count DESC
    ` as Array<{
      provider: string;
      count: number;
      totalAmount: number;
      averageAmount: number;
    }>;

    // Get route efficiency metrics
    const routeEfficiency = await db.$queryRaw`
      SELECT 
        r.id,
        r.name,
        r.city,
        r.distanceKm,
        COUNT(DISTINCT b.id) as activeBuses,
        COUNT(booking.id) as totalBookings,
        AVG(t.delayMin) as avgDelay,
        SUM(p.amount) as totalRevenue
      FROM routes r
      LEFT JOIN schedules s ON r.id = s.routeId
      LEFT JOIN buses b ON s.busId = b.id AND b.status = 'ACTIVE'
      LEFT JOIN bookings booking ON r.id = booking.routeId AND booking.createdAt >= ${fromDate}
      LEFT JOIN payments p ON booking.id = p.bookingId AND p.status = 'success'
      LEFT JOIN telemetry t ON b.id = t.busId
      GROUP BY r.id, r.name, r.city, r.distanceKm
      HAVING COUNT(DISTINCT b.id) > 0
      ORDER BY totalRevenue DESC
      LIMIT 15
    ` as Array<{
      id: string;
      name: string;
      city: string;
      distanceKm: number;
      activeBuses: number;
      totalBookings: number;
      avgDelay: number | null;
      totalRevenue: number;
    }>;

    // Calculate summary metrics
    const summary = {
      totalUsers,
      totalBuses,
      totalRoutes,
      totalBookings: totalBookings,
      activeBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      averageRevenuePerBooking: activeBookings > 0 ? (totalRevenue._sum.amount || 0) / activeBookings : 0,
      bookingConversionRate: totalBookings > 0 ? (activeBookings / totalBookings) * 100 : 0,
      periodDays: parseInt(period)
    };

    return NextResponse.json({
      summary,
      trends: {
        bookings: bookingTrends,
        revenue: revenueTrends,
        userActivity
      },
      insights: {
        popularRoutes,
        busPerformance,
        paymentMethods,
        routeEfficiency
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/analytics/custom - Run custom analytics query
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { query, parameters } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Valid SQL query is required" },
        { status: 400 }
      );
    }

    // Basic security check - prevent dangerous operations
    const dangerousPatterns = [
      /DROP\s+TABLE/i,
      /DELETE\s+FROM/i,
      /UPDATE\s+\w+\s+SET/i,
      /INSERT\s+INTO/i,
      /ALTER\s+TABLE/i,
      /CREATE\s+TABLE/i,
      /TRUNCATE/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(query)) {
        return NextResponse.json(
          { error: "Query contains potentially dangerous operations" },
          { status: 400 }
        );
      }
    }

    // Execute custom query
    const result = await db.$queryRawUnsafe(query, ...(parameters || []));

    return NextResponse.json({
      data: result,
      query,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error executing custom analytics query:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}