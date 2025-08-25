import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/schedules - Get all schedules with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const busId = searchParams.get("busId");
    const routeId = searchParams.get("routeId");
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (busId) {
      where.busId = busId;
    }
    
    if (routeId) {
      where.routeId = routeId;
    }
    
    if (city) {
      where.route = {
        city: {
          contains: city,
          mode: "insensitive"
        }
      };
    }

    const [schedules, total] = await Promise.all([
      db.schedule.findMany({
        where,
        include: {
          bus: {
            select: {
              id: true,
              busNumber: true,
              operator: true,
              type: true,
              capacity: true,
              status: true
            }
          },
          route: {
            select: {
              id: true,
              name: true,
              city: true,
              distanceKm: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          departureTime: "asc"
        }
      }),
      db.schedule.count({ where })
    ]);

    return NextResponse.json({
      schedules,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Create a new schedule
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      busId,
      routeId,
      departureTime,
      arrivalTime,
      daysActive,
      frequencyMin,
      baseEtaProfile
    } = body;

    // Validate required fields
    if (!busId || !routeId || !departureTime || !arrivalTime || daysActive === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if bus exists
    const bus = await db.bus.findUnique({
      where: { id: busId }
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Check if route exists
    const route = await db.route.findUnique({
      where: { id: routeId }
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Validate daysActive (bitmask 0-127 for 7 days)
    if (daysActive < 0 || daysActive > 127) {
      return NextResponse.json(
        { error: "Invalid daysActive value" },
        { status: 400 }
      );
    }

    // Validate time logic
    if (new Date(arrivalTime) <= new Date(departureTime)) {
      return NextResponse.json(
        { error: "Arrival time must be after departure time" },
        { status: 400 }
      );
    }

    // Create schedule
    const schedule = await db.schedule.create({
      data: {
        busId,
        routeId,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        daysActive,
        frequencyMin,
        baseEtaProfile
      },
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            operator: true,
            type: true,
            capacity: true,
            status: true
          }
        },
        route: {
          select: {
            id: true,
            name: true,
            city: true,
            distanceKm: true
          }
        }
      }
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}