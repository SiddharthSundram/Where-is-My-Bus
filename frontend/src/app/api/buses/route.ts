import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BusStatus, BusType } from "@prisma/client";

// GET /api/buses - Get all buses with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const type = searchParams.get("type") as BusType | null;
    const status = searchParams.get("status") as BusStatus | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (city) {
      // Filter by city through routes
      where.schedules = {
        some: {
          route: {
            city: {
              contains: city,
              mode: "insensitive"
            }
          }
        }
      };
    }
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        {
          busNumber: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          operator: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          registrationNo: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    const [buses, total] = await Promise.all([
      db.bus.findMany({
        where,
        include: {
          schedules: {
            include: {
              route: true
            }
          },
          _count: {
            select: {
              bookings: true,
              telemetry: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.bus.count({ where })
    ]);

    return NextResponse.json({
      buses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/buses - Create a new bus
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      busNumber,
      operator,
      type,
      capacity,
      registrationNo,
      gpsDeviceId,
      status = BusStatus.ACTIVE
    } = body;

    // Validate required fields
    if (!busNumber || !operator || !type || !capacity || !registrationNo || !gpsDeviceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if bus number already exists
    const existingBus = await db.bus.findUnique({
      where: { busNumber }
    });

    if (existingBus) {
      return NextResponse.json(
        { error: "Bus number already exists" },
        { status: 400 }
      );
    }

    // Check if registration number already exists
    const existingRegistration = await db.bus.findUnique({
      where: { registrationNo }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Registration number already exists" },
        { status: 400 }
      );
    }

    // Check if GPS device ID already exists
    const existingGpsDevice = await db.bus.findUnique({
      where: { gpsDeviceId }
    });

    if (existingGpsDevice) {
      return NextResponse.json(
        { error: "GPS device ID already exists" },
        { status: 400 }
      );
    }

    // Create bus
    const bus = await db.bus.create({
      data: {
        busNumber,
        operator,
        type,
        capacity,
        registrationNo,
        gpsDeviceId,
        status
      },
      include: {
        schedules: {
          include: {
            route: true
          }
        }
      }
    });

    return NextResponse.json(bus, { status: 201 });
  } catch (error) {
    console.error("Error creating bus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}