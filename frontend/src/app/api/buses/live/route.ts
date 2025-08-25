import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/buses/live - Get real-time bus locations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get("routeId");
    const city = searchParams.get("city");
    const bounds = searchParams.get("bounds"); // format: "lat1,lng1,lat2,lng2"

    // Get buses with their latest telemetry
    const busesQuery = `
      SELECT 
        b.id,
        b.busNumber,
        b.operator,
        b.type,
        b.capacity,
        b.status,
        b.currentLocation,
        t.timestamp as lastUpdate,
        t.speed,
        t.heading,
        t.trafficLevel,
        t.delayMin,
        r.id as routeId,
        r.name as routeName,
        r.city as routeCity
      FROM buses b
      LEFT JOIN telemetry t ON b.id = t.busId
      LEFT JOIN schedules s ON b.id = s.busId
      LEFT JOIN routes r ON s.routeId = r.id
      WHERE t.timestamp = (
        SELECT MAX(timestamp) 
        FROM telemetry t2 
        WHERE t2.busId = b.id
      )
      AND b.status = 'ACTIVE'
    `;

    let whereClause = "";
    const params: any[] = [];

    if (routeId) {
      whereClause += " AND r.id = ?";
      params.push(routeId);
    }

    if (city) {
      whereClause += " AND r.city = ?";
      params.push(city);
    }

    if (bounds) {
      const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
      whereClause += ` AND 
        b.currentLocation->>'$.coordinates[0]' BETWEEN ? AND ? AND
        b.currentLocation->>'$.coordinates[1]' BETWEEN ? AND ?`;
      params.push(lng1, lng2, lat1, lat2);
    }

    const finalQuery = busesQuery + whereClause + " GROUP BY b.id";

    // Execute raw query for better performance with spatial data
    const buses = await db.$queryRawUnsafe(finalQuery, ...params);

    // Calculate ETAs for each bus
    const busesWithETA = await Promise.all(
      (buses as any[]).map(async (bus) => {
        if (!bus.routeId) return bus;

        // Get next stops for this bus based on current location and schedule
        const schedule = await db.schedule.findFirst({
          where: {
            busId: bus.id,
            routeId: bus.routeId
          },
          include: {
            route: {
              include: {
                stops: {
                  orderBy: { index: "asc" }
                }
              }
            }
          }
        });

        if (!schedule) return bus;

        // Simple ETA calculation (in real implementation, this would use traffic data and ML)
        const nextStops = schedule.route.stops.filter((stop: any, index: number) => {
          // This is a simplified version - real implementation would calculate distance
          return index > 0; // Skip first stop as starting point
        });

        return {
          ...bus,
          nextStops: nextStops.slice(0, 3), // Next 3 stops
          estimatedArrivals: nextStops.slice(0, 3).map(() => {
            // Simplified ETA calculation
            const baseETA = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
            return baseETA + (bus.delayMin || 0);
          })
        };
      })
    );

    return NextResponse.json({
      buses: busesWithETA,
      timestamp: new Date().toISOString(),
      count: busesWithETA.length
    });
  } catch (error) {
    console.error("Error fetching live buses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}