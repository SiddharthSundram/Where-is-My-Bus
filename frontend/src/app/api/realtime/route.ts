import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/realtime/subscriptions - Get active WebSocket subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This would typically integrate with your WebSocket server
    // For now, we'll return subscription statistics
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'buses', 'routes', 'users', etc.

    // Get active subscription counts (simplified)
    const subscriptions = {
      buses: Math.floor(Math.random() * 1000) + 100, // Simulated active bus trackers
      routes: Math.floor(Math.random() * 500) + 50,   // Simulated route watchers
      users: Math.floor(Math.random() * 200) + 20,   // Simulated active user sessions
      total: Math.floor(Math.random() * 1500) + 200   // Total active connections
    };

    if (type && subscriptions[type as keyof typeof subscriptions]) {
      return NextResponse.json({
        type,
        count: subscriptions[type as keyof typeof subscriptions],
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      subscriptions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching realtime subscriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/realtime/broadcast - Broadcast real-time updates
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      data,
      target, // 'all', 'route', 'bus', 'user'
      targetId
    } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type, data" },
        { status: 400 }
      );
    }

    // Broadcast via WebSocket
    try {
      let rooms = [];
      
      switch (target) {
        case 'all':
          rooms = ['global'];
          break;
        case 'route':
          rooms = targetId ? [`route_${targetId}`] : [];
          break;
        case 'bus':
          rooms = targetId ? [`bus_${targetId}`] : [];
          break;
        case 'user':
          rooms = targetId ? [`user_${targetId}`] : [];
          break;
        default:
          rooms = ['global'];
      }

      if (rooms.length === 0) {
        return NextResponse.json(
          { error: "Invalid target or targetId" },
          { status: 400 }
        );
      }

      // WebSocket integration would go here
      console.log('Real-time broadcast sent to:', rooms.join(', '));
    } catch (socketError) {
      console.error('WebSocket not available for broadcasting:', socketError);
      
      // Fallback: Store broadcast for later delivery
      try {
        await db.analyticsCache.create({
          data: {
            reportType: "realtime_broadcast",
            paramsHash: Date.now().toString(),
            computedAt: new Date(),
            payload: {
              type,
              data,
              target,
              targetId,
              timestamp: new Date().toISOString(),
              status: "queued"
            }
          }
        });
      } catch (dbError) {
        console.error('Failed to store broadcast:', dbError);
      }

      return NextResponse.json({
        message: "Broadcast queued (WebSocket unavailable)",
        type,
        target,
        targetId,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error broadcasting real-time update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/realtime/stats - Get real-time system statistics
export async function GET_stats(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get real-time system statistics
    const [
      activeUsers,
      activeBuses,
      recentBookings,
      systemLoad
    ] = await Promise.all([
      // Active users in last 5 minutes
      db.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000)
          }
        }
      }),
      // Active buses with recent telemetry
      db.bus.count({
        where: {
          status: "ACTIVE",
          telemetry: {
            some: {
              timestamp: {
                gte: new Date(Date.now() - 2 * 60 * 1000) // Last 2 minutes
              }
            }
          }
        }
      }),
      // Recent bookings in last hour
      db.booking.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000)
          }
        }
      }),
      // System load indicators
      db.$queryRaw`
        SELECT 
          COUNT(*) as totalConnections,
          AVG(CASE WHEN timestamp > ${new Date(Date.now() - 60 * 1000)} THEN 1 ELSE 0 END) as avgActivity
        FROM telemetry 
        WHERE timestamp > ${new Date(Date.now() - 5 * 60 * 1000)}
      ` as unknown as Array<{ totalConnections: number; avgActivity: number }>
    ]);

    // Get recent alerts
    const recentAlerts = await db.notification.findMany({
      where: {
        type: {
          in: ["DELAY_ALERT", "ETA_UPDATE", "ADMIN_MESSAGE"]
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    // Calculate system health score
    const healthScore = Math.min(100, (
      (activeUsers > 0 ? 25 : 0) +
      (activeBuses > 0 ? 25 : 0) +
      (recentBookings > 0 ? 25 : 0) +
      (systemLoad[0]?.totalConnections > 0 ? 25 : 0)
    ));

    return NextResponse.json({
      stats: {
        activeUsers,
        activeBuses,
        recentBookings,
        systemLoad: systemLoad[0] || { totalConnections: 0, avgActivity: 0 },
        healthScore,
        recentAlerts: recentAlerts.length
      },
      recentAlerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching realtime stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}