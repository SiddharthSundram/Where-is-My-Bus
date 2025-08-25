import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

// GET /api/bookings - Get user bookings with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const busId = searchParams.get("busId");
    const routeId = searchParams.get("routeId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Regular users can only see their own bookings
    if (session.user.role === "USER") {
      where.userId = session.user.id;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (busId) {
      where.busId = busId;
    }
    
    if (routeId) {
      where.routeId = routeId;
    }

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          bus: {
            select: {
              id: true,
              busNumber: true,
              operator: true,
              type: true
            }
          },
          route: {
            select: {
              id: true,
              name: true,
              city: true,
              distanceKm: true
            }
          },
          fromStop: {
            select: {
              id: true,
              name: true,
              index: true
            }
          },
          toStop: {
            select: {
              id: true,
              name: true,
              index: true
            }
          },
          payments: {
            select: {
              id: true,
              status: true,
              amount: true,
              currency: true,
              createdAt: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.booking.count({ where })
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      busId,
      routeId,
      fromStopId,
      toStopId,
      seatType,
      seatCount
    } = body;

    // Validate required fields
    if (!busId || !routeId || !fromStopId || !toStopId || !seatType || !seatCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate seat count
    if (seatCount < 1 || seatCount > 6) {
      return NextResponse.json(
        { error: "Seat count must be between 1 and 6" },
        { status: 400 }
      );
    }

    // Verify bus exists and is active
    const bus = await db.bus.findUnique({
      where: { id: busId, status: "ACTIVE" }
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus not found or inactive" }, { status: 404 });
    }

    // Verify route exists
    const route = await db.route.findUnique({
      where: { id: routeId },
      include: {
        stops: {
          orderBy: { index: "asc" }
        }
      }
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Verify stops exist and are in correct order
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

    // Calculate fare (simplified calculation)
    const baseFare = 10; // Base fare in currency units
    const distanceFare = route.distanceKm * 2; // 2 units per km
    const seatTypeMultiplier = seatType === "AC" ? 1.5 : 1.0;
    const fare = Math.round((baseFare + distanceFare) * seatTypeMultiplier * seatCount);

    // Check availability (simplified - in real implementation, check actual capacity)
    const activeBookings = await db.booking.count({
      where: {
        busId,
        status: BookingStatus.PAID,
        OR: [
          { fromStopId: { lte: toStopId } },
          { toStopId: { gte: fromStopId } }
        ]
      }
    });

    if (activeBookings >= bus.capacity) {
      return NextResponse.json(
        { error: "Bus is fully booked" },
        { status: 400 }
      );
    }

    // Create booking with hold
    const holdExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes hold
    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        busId,
        routeId,
        fromStopId,
        toStopId,
        seatType,
        seatCount,
        fare,
        status: BookingStatus.PENDING,
        holdExpiresAt: holdExpiry
      },
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            operator: true,
            type: true
          }
        },
        route: {
          select: {
            id: true,
            name: true,
            city: true,
            distanceKm: true
          }
        },
        fromStop: {
          select: {
            id: true,
            name: true
          }
        },
        toStop: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Create notification for user
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "BOOKING_CONFIRMATION",
        title: "Booking Hold Confirmed",
        body: `Your booking for ${route.name} is held for 15 minutes. Please complete payment.`,
        metadata: {
          bookingId: booking.id,
          holdExpiry: holdExpiry.toISOString()
        }
      }
    });

    return NextResponse.json({
      booking,
      paymentRequired: true,
      holdExpiry: holdExpiry.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}