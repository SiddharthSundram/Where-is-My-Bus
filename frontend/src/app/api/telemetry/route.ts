import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/telemetry - Submit bus telemetry data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow both authenticated users and device submissions (for GPS devices)
    const body = await request.json();
    const {
      busId,
      location,
      speed,
      heading,
      trafficLevel,
      delayMin,
      deviceId,
      timestamp
    } = body;

    // Validate required fields
    if (!busId || !location || !location.coordinates || location.coordinates.length !== 2) {
      return NextResponse.json(
        { error: "Missing required fields: busId, location with coordinates" },
        { status: 400 }
      );
    }

    // Verify bus exists
    const bus = await db.bus.findUnique({
      where: { id: busId }
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // For device submissions, verify the device ID matches
    if (deviceId && bus.gpsDeviceId !== deviceId) {
      return NextResponse.json({ error: "Device ID mismatch" }, { status: 401 });
    }

    // For user submissions, verify admin permissions
    if (!deviceId && (!session || session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create telemetry record
    const telemetry = await db.telemetry.create({
      data: {
        busId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        location: {
          type: "Point",
          coordinates: location.coordinates
        },
        speed: speed || null,
        heading: heading || null,
        trafficLevel: trafficLevel || null,
        delayMin: delayMin || null
      }
    });

    // Update bus current location
    await db.bus.update({
      where: { id: busId },
      data: {
        currentLocation: {
          type: "Point",
          coordinates: location.coordinates
        }
      }
    });

    return NextResponse.json(telemetry, { status: 201 });
  } catch (error) {
    console.error("Error creating telemetry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/telemetry - Get telemetry data with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const busId = searchParams.get("busId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (busId) {
      where.busId = busId;
    }
    
    if (from) {
      where.timestamp = {
        gte: new Date(from)
      };
    }
    
    if (to) {
      where.timestamp = {
        ...where.timestamp,
        lte: new Date(to)
      };
    }

    const [telemetry, total] = await Promise.all([
      db.telemetry.findMany({
        where,
        include: {
          bus: {
            select: {
              id: true,
              busNumber: true,
              operator: true,
              type: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          timestamp: "desc"
        }
      }),
      db.telemetry.count({ where })
    ]);

    return NextResponse.json({
      telemetry,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}