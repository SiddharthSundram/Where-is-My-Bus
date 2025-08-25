import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/routes/eta - Calculate ETA for route
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      routeId,
      fromStopId,
      toStopId,
      departureTime,
      considerTraffic = true,
      considerWeather = false
    } = body;

    // Validate required fields
    if (!routeId || !fromStopId || !toStopId) {
      return NextResponse.json(
        { error: "Missing required fields: routeId, fromStopId, toStopId" },
        { status: 400 }
      );
    }

    // Get route details with stops
    const route = await db.route.findUnique({
      where: { id: routeId },
      include: {
        stops: {
          orderBy: { index: "asc" }
        },
        schedules: {
          include: {
            bus: {
              select: {
                id: true,
                busNumber: true,
                currentLocation: true
              }
            }
          }
        }
      }
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Find the stops
    const fromStop = route.stops.find(stop => stop.id === fromStopId);
    const toStop = route.stops.find(stop => stop.id === toStopId);

    if (!fromStop || !toStop) {
      return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    }

    if (fromStop.index >= toStop.index) {
      return NextResponse.json(
        { error: "From stop must be before to stop" },
        { status: 400 }
      );
    }

    // Calculate base travel time
    const stopCount = toStop.index - fromStop.index;
    const distancePerStop = route.distanceKm / route.stops.length;
    const travelDistance = distancePerStop * stopCount;
    
    // Base speed assumptions (km/h)
    const baseSpeed = 30; // Average city bus speed
    const baseTravelTime = (travelDistance / baseSpeed) * 60; // Convert to minutes

    // Get current traffic conditions from recent telemetry
    let trafficMultiplier = 1.0;
    if (considerTraffic) {
      const recentTelemetry = await db.telemetry.findMany({
        where: {
          busId: {
            in: route.schedules.map(s => s.busId)
          },
          timestamp: {
            gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
          }
        },
        orderBy: {
          timestamp: "desc"
        },
        take: 50
      });

      if (recentTelemetry.length > 0) {
        const avgTrafficLevel = recentTelemetry.reduce((sum, t) => sum + (t.trafficLevel || 3), 0) / recentTelemetry.length;
        // Traffic level: 1=light, 2=moderate, 3=heavy, 4=severe, 5=extreme
        trafficMultiplier = 1 + (avgTrafficLevel - 3) * 0.2; // Adjust speed based on traffic
      }
    }

    // Calculate stops time (2 minutes per stop)
    const stopsTime = (stopCount - 1) * 2;

    // Calculate total ETA
    let totalETA = Math.round(baseTravelTime * trafficMultiplier + stopsTime);

    // Get real-time bus locations for nearby buses
    const nearbyBuses = await Promise.all(
      route.schedules.map(async (schedule) => {
        if (!schedule.bus.currentLocation) return null;

        const latestTelemetry = await db.telemetry.findFirst({
          where: { busId: schedule.bus.id },
          orderBy: { timestamp: "desc" }
        });

        if (!latestTelemetry) return null;

        // Simple distance calculation (in real implementation, use proper geospatial queries)
        const busLocation = latestTelemetry.location as any;
        const fromStopLocation = fromStop.location as any;
        
        const busLat = busLocation.coordinates[1];
        const busLng = busLocation.coordinates[0];
        const fromLat = fromStopLocation.coordinates[1];
        const fromLng = fromStopLocation.coordinates[0];

        const distance = Math.sqrt(
          Math.pow(busLat - fromLat, 2) + Math.pow(busLng - fromLng, 2)
        ) * 111; // Rough km conversion

        return {
          busId: schedule.bus.id,
          busNumber: schedule.bus.busNumber,
          distance: distance,
          currentLocation: latestTelemetry.location,
          speed: latestTelemetry.speed,
          delay: latestTelemetry.delayMin || 0,
          estimatedArrival: distance > 0 ? Math.round((distance / (latestTelemetry.speed || 30)) * 60) : null
        };
      })
    );

    const availableBuses = nearbyBuses.filter((bus): bus is NonNullable<typeof bus> => bus !== null).sort((a, b) => a.distance - b.distance);

    // Calculate best ETA considering nearby buses
    let bestETA = totalETA;
    let recommendedBus = null;

    if (availableBuses.length > 0) {
      const closestBus = availableBuses[0];
      if (closestBus.estimatedArrival && closestBus.estimatedArrival < totalETA) {
        bestETA = closestBus.estimatedArrival + (closestBus.delay || 0);
        recommendedBus = {
          busId: closestBus.busId,
          busNumber: closestBus.busNumber,
          distance: closestBus.distance,
          estimatedArrival: closestBus.estimatedArrival
        };
      }
    }

    // Get schedule-based ETAs
    const scheduleETAs = await Promise.all(
      route.schedules.map(async (schedule) => {
        const now = new Date();
        const departure = new Date(schedule.departureTime);
        
        // Find next occurrence of this schedule
        const daysActive = schedule.daysActive;
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayBit = 1 << currentDay;
        
        if ((daysActive & dayBit) === 0) {
          return null; // Schedule not active today
        }

        // If departure time has passed, find next occurrence
        let nextDeparture = new Date(departure);
        nextDeparture.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (nextDeparture < now) {
          nextDeparture.setDate(nextDeparture.getDate() + 1);
        }

        // Calculate ETA from departure
        const arrivalTime = new Date(nextDeparture.getTime() + totalETA * 60000);

        return {
          scheduleId: schedule.id,
          busId: schedule.busId,
          busNumber: schedule.bus.busNumber,
          departureTime: nextDeparture.toISOString(),
          estimatedArrival: arrivalTime.toISOString(),
          totalDuration: totalETA
        };
      })
    );

    const validScheduleETAs = scheduleETAs.filter((schedule): schedule is NonNullable<typeof schedule> => schedule !== null).sort((a, b) => 
      new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    );

    // Prepare response
    const response = {
      route: {
        id: route.id,
        name: route.name,
        city: route.city,
        distanceKm: route.distanceKm
      },
      journey: {
        fromStop: {
          id: fromStop.id,
          name: fromStop.name,
          index: fromStop.index
        },
        toStop: {
          id: toStop.id,
          name: toStop.name,
          index: toStop.index
        },
        stopCount,
        distance: travelDistance
      },
      eta: {
        bestCase: Math.round(totalETA * 0.8), // Optimistic estimate
        average: totalETA,
        worstCase: Math.round(totalETA * 1.2), // Conservative estimate
        recommended: bestETA,
        recommendedBus
      },
      factors: {
        trafficMultiplier: considerTraffic ? trafficMultiplier : 1.0,
        baseSpeed,
        stopsTime,
        considerTraffic,
        considerWeather
      },
      nearbyBuses: availableBuses.slice(0, 5), // Top 5 nearby buses
      scheduleETAs: validScheduleETAs.slice(0, 3), // Next 3 scheduled departures
      calculatedAt: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error calculating ETA:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/routes/eta/live - Get live ETAs for all active routes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    // Get all active routes with live bus data
    const routes = await db.route.findMany({
      where: city ? { city } : {},
      include: {
        stops: {
          orderBy: { index: "asc" }
        },
        schedules: {
          include: {
            bus: {
              include: {
                telemetry: {
                  orderBy: { timestamp: "desc" },
                  take: 1
                }
              }
            }
          },
          where: {
            bus: {
              status: "ACTIVE"
            }
          }
        }
      }
    });

    const liveETAs = await Promise.all(
      routes.map(async (route) => {
        const activeBuses = route.schedules.filter(schedule => 
          schedule.bus.telemetry.length > 0
        );

        if (activeBuses.length === 0) {
          return {
            routeId: route.id,
            routeName: route.name,
            city: route.city,
            status: "no_active_buses",
            buses: []
          };
        }

        const busesWithETA = await Promise.all(
          activeBuses.map(async (schedule) => {
            const telemetry = schedule.bus.telemetry[0];
            if (!telemetry) return null;

            // Calculate ETA to each stop (simplified)
            const busETAs = await Promise.all(
              route.stops.map(async (stop, index) => {
                // Simple ETA calculation based on current speed and distance
                const busLocation = telemetry.location as any;
                const stopLocation = stop.location as any;
                
                const busLat = busLocation.coordinates[1];
                const busLng = busLocation.coordinates[0];
                const stopLat = stopLocation.coordinates[1];
                const stopLng = stopLocation.coordinates[0];

                const distance = Math.sqrt(
                  Math.pow(busLat - stopLat, 2) + Math.pow(busLng - stopLng, 2)
                ) * 111; // Rough km conversion

                const speed = telemetry.speed || 30; // km/h
                const delay = telemetry.delayMin || 0;
                const eta = distance > 0 ? Math.round((distance / speed) * 60 + delay) : null;

                return {
                  stopId: stop.id,
                  stopName: stop.name,
                  stopIndex: index,
                  distance,
                  eta,
                  delay
                };
              })
            );

            return {
              busId: schedule.bus.id,
              busNumber: schedule.bus.busNumber,
              currentLocation: telemetry.location,
              speed: telemetry.speed,
              heading: telemetry.heading,
              delay: telemetry.delayMin,
              lastUpdate: telemetry.timestamp,
              etas: busesWithETA.filter(eta => eta.eta !== null).sort((a, b) => a.eta - b.eta)
            };
          })
        );

        return {
          routeId: route.id,
          routeName: route.name,
          city: route.city,
          status: "active",
          buses: busesWithETA.filter(Boolean)
        };
      })
    );

    return NextResponse.json({
      liveETAs,
      totalRoutes: routes.length,
      activeRoutes: liveETAs.filter(route => route.status === "active").length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching live ETAs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}