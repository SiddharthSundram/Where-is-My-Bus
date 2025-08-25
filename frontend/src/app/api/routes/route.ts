import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/routes - Get all routes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const includeStops = searchParams.get("includeStops") === "true";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive"
      };
    }
    
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    const [routes, total] = await Promise.all([
      db.route.findMany({
        where,
        include: {
          stops: includeStops ? {
            orderBy: { index: "asc" }
          } : false,
          schedules: {
            include: {
              bus: true
            }
          },
          _count: {
            select: {
              stops: true,
              schedules: true,
              bookings: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.route.count({ where })
    ]);

    return NextResponse.json({
      routes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/routes - Create a new route
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      city,
      name,
      distanceKm,
      polyline,
      stops
    } = body;

    // Validate required fields
    if (!city || !name || !distanceKm || !stops || !Array.isArray(stops)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate stops structure
    for (const stop of stops) {
      if (!stop.name || !stop.location || !stop.location.coordinates || 
          stop.location.coordinates.length !== 2) {
        return NextResponse.json(
          { error: "Invalid stop data" },
          { status: 400 }
        );
      }
    }

    // Create route with stops in a transaction
    const result = await db.$transaction(async (prisma) => {
      const route = await prisma.route.create({
        data: {
          city,
          name,
          distanceKm,
          polyline
        }
      });

      // Create stops
      const stopData = stops.map((stop: any, index: number) => ({
        routeId: route.id,
        name: stop.name,
        index,
        location: {
          type: "Point",
          coordinates: stop.location.coordinates
        }
      }));

      await prisma.stop.createMany({
        data: stopData
      });

      return prisma.route.findUnique({
        where: { id: route.id },
        include: {
          stops: {
            orderBy: { index: "asc" }
          }
        }
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}