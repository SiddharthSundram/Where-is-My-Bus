import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/system/status - Get comprehensive system status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get system metrics
    const [
      totalUsers,
      activeUsers,
      totalBuses,
      activeBuses,
      totalRoutes,
      totalSchedules,
      totalBookings,
      activeBookings,
      totalRevenue,
      recentBookings,
      systemAlerts
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // Active users (last 7 days)
      db.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Total buses
      db.bus.count(),
      
      // Active buses
      db.bus.count({
        where: { status: "ACTIVE" }
      }),
      
      // Total routes
      db.route.count(),
      
      // Total schedules
      db.schedule.count(),
      
      // Total bookings
      db.booking.count(),
      
      // Active bookings (paid)
      db.booking.count({
        where: { status: "PAID" }
      }),
      
      // Total revenue
      db.payment.aggregate({
        where: { status: "success" },
        _sum: { amount: true }
      }),
      
      // Recent bookings (last 24 hours)
      db.booking.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // System alerts (unread admin notifications)
      db.notification.count({
        where: {
          type: "ADMIN_MESSAGE",
          read: false,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get database health metrics
    const dbHealth = await getDatabaseHealth();

    // Get API performance metrics
    const apiPerformance = await getAPIPerformance();

    // Get real-time system metrics
    const realtimeMetrics = await getRealtimeMetrics();

    // Calculate system health score
    const healthScore = calculateSystemHealth({
      totalUsers,
      activeUsers,
      activeBuses,
      totalBuses,
      activeBookings,
      totalBookings,
      dbHealth,
      apiPerformance,
      systemAlerts
    });

    // Get recent system events
    const recentEvents = await getRecentSystemEvents();

    const systemStatus = {
      overview: {
        healthScore,
        status: getHealthStatus(healthScore),
        lastUpdated: new Date().toISOString(),
        uptime: process.uptime()
      },
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          activityRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
        },
        buses: {
          total: totalBuses,
          active: activeBuses,
          utilizationRate: totalBuses > 0 ? (activeBuses / totalBuses) * 100 : 0
        },
        routes: {
          total: totalRoutes,
          schedules: totalSchedules
        },
        bookings: {
          total: totalBookings,
          active: activeBookings,
          conversionRate: totalBookings > 0 ? (activeBookings / totalBookings) * 100 : 0,
          recent: recentBookings
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          currency: "INR"
        },
        alerts: {
          count: systemAlerts,
          level: systemAlerts > 10 ? "high" : systemAlerts > 5 ? "medium" : "low"
        }
      },
      health: {
        database: dbHealth,
        api: apiPerformance,
        realtime: realtimeMetrics
      },
      recentEvents,
      recommendations: generateRecommendations({
        healthScore,
        activeBuses,
        totalBuses,
        activeUsers,
        totalUsers,
        systemAlerts
      })
    };

    return NextResponse.json(systemStatus);
  } catch (error: any) {
    console.error("Error getting system status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
async function getDatabaseHealth() {
  try {
    // Test database connectivity
    const startTime = Date.now();
    await db.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    // Get database size (simplified)
    const tables = await Promise.all([
      db.user.count(),
      db.bus.count(),
      db.route.count(),
      db.booking.count(),
      db.telemetry.count()
    ]);

    return {
      status: "healthy",
      responseTime,
      tables: {
        users: tables[0],
        buses: tables[1],
        routes: tables[2],
        bookings: tables[3],
        telemetry: tables[4]
      },
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: null,
      error: error.message,
      lastChecked: new Date().toISOString()
    };
  }
}

async function getAPIPerformance() {
  // This would typically integrate with your API monitoring system
  // For now, we'll return simulated metrics
  return {
    averageResponseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
    errorRate: Math.random() * 2, // 0-2%
    requestsPerMinute: Math.floor(Math.random() * 1000) + 100, // 100-1100 rpm
    uptime: 99.9,
    lastChecked: new Date().toISOString()
  };
}

async function getRealtimeMetrics() {
  // Get real-time metrics from recent telemetry
  const recentTelemetry = await db.telemetry.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      }
    },
    orderBy: {
      timestamp: "desc"
    },
    take: 100
  });

  const activeBuses = new Set(recentTelemetry.map(t => t.busId)).size;
  const avgSpeed = recentTelemetry.reduce((sum, t) => sum + (t.speed || 0), 0) / recentTelemetry.length;
  const avgDelay = recentTelemetry.reduce((sum, t) => sum + (t.delayMin || 0), 0) / recentTelemetry.length;

  return {
    activeConnections: activeBuses,
    averageSpeed: Math.round(avgSpeed),
    averageDelay: Math.round(avgDelay),
    dataPoints: recentTelemetry.length,
    lastUpdated: new Date().toISOString()
  };
}

function calculateSystemHealth(metrics: any): number {
  let score = 100;

  // Deduct for low bus utilization
  const busUtilization = metrics.totalBuses > 0 ? (metrics.activeBuses / metrics.totalBuses) * 100 : 0;
  if (busUtilization < 50) score -= 10;
  if (busUtilization < 25) score -= 10;

  // Deduct for low user activity
  const userActivity = metrics.totalUsers > 0 ? (metrics.activeUsers / metrics.totalUsers) * 100 : 0;
  if (userActivity < 20) score -= 10;
  if (userActivity < 10) score -= 10;

  // Deduct for database issues
  if (metrics.dbHealth.status !== "healthy") score -= 20;
  if (metrics.dbHealth.responseTime > 1000) score -= 10;

  // Deduct for API performance issues
  if (metrics.apiPerformance.errorRate > 5) score -= 15;
  if (metrics.apiPerformance.averageResponseTime > 500) score -= 10;

  // Deduct for system alerts
  if (metrics.systemAlerts > 10) score -= 10;
  if (metrics.systemAlerts > 20) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function getHealthStatus(score: number): string {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  if (score >= 40) return "poor";
  return "critical";
}

async function getRecentSystemEvents() {
  // Get recent system events from notifications and logs
  const events = await db.notification.findMany({
    where: {
      type: {
        in: ["ADMIN_MESSAGE", "DELAY_ALERT"] as const
      },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      createdAt: true,
      metadata: true
    }
  });

  return events.map(event => ({
    id: event.id,
    type: event.type,
    title: event.title,
    description: event.body,
    timestamp: event.createdAt,
    severity: getEventSeverity(event.type)
  }));
}

function getEventSeverity(type: string): string {
  switch (type) {
    case "DELAY_ALERT": return "warning";
    case "ADMIN_MESSAGE": return "info";
    default: return "info";
  }
}

function generateRecommendations(metrics: any): string[] {
  const recommendations: string[] = [];

  if (metrics.healthScore < 60) {
    recommendations.push("System health is below optimal levels. Consider immediate investigation.");
  }

  if (metrics.activeBuses / metrics.totalBuses < 0.5) {
    recommendations.push("Bus utilization is low. Consider optimizing schedules or adding more routes.");
  }

  if (metrics.activeUsers / metrics.totalUsers < 0.2) {
    recommendations.push("User engagement is low. Consider marketing campaigns or feature improvements.");
  }

  if (metrics.systemAlerts > 10) {
    recommendations.push("High number of system alerts. Review and address outstanding issues.");
  }

  if (recommendations.length === 0) {
    recommendations.push("System is performing well. Continue monitoring for optimal performance.");
  }

  return recommendations;
}