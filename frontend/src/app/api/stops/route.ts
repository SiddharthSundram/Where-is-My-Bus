import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/stops - Get all stops with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get("routeId");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
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
    
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive"
      };
    }

    const [stops, total] = await Promise.all([
      db.stop.findMany({
        where,
        include: {
          route: {
            select: {
              id: true,
              name: true,
              city: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { routeId: "asc" },
          { index: "asc" }
        ]
      }),
      db.stop.count({ where })
    ]);

    return NextResponse.json({
      stops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching stops:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/stops - Create a new stop
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      routeId,
      name,
      index,
      location
    } = body;

    // Validate required fields
    if (!routeId || !name || index === undefined || !location || !location.coordinates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if route exists
    const route = await db.route.findUnique({
      where: { id: routeId }
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Check if stop index conflicts with existing stops
    const existingStop = await db.stop.findFirst({
      where: {
        routeId,
        index
      }
    });

    if (existingStop) {
      return NextResponse.json(
        { error: "Stop index already exists for this route" },
        { status: 400 }
      );
    }

    // Create stop
    const stop = await db.stop.create({
      data: {
        routeId,
        name,
        index,
        location: {
          type: "Point",
          coordinates: location.coordinates
        }
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    console.error("Error creating stop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}