import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/routes/[id] - Get a specific route
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const route = await db.route.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { index: "asc" }
        },
        schedules: {
          include: {
            bus: true
          }
        }
      }
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/routes/[id] - Update a route
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if route exists
    const existingRoute = await db.route.findUnique({
      where: { id }
    });

    if (!existingRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Update route and stops in a transaction
    const result = await db.$transaction(async (prisma) => {
      // Update route
      const updatedRoute = await prisma.route.update({
        where: { id },
        data: {
          ...(city && { city }),
          ...(name && { name }),
          ...(distanceKm !== undefined && { distanceKm }),
          ...(polyline !== undefined && { polyline })
        }
      });

      // Update stops if provided
      if (stops && Array.isArray(stops)) {
        // Delete existing stops
        await prisma.stop.deleteMany({
          where: { routeId: id }
        });

        // Create new stops
        const stopData = stops.map((stop: any, index: number) => ({
          routeId: id,
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
      }

      return prisma.route.findUnique({
        where: { id },
        include: {
          stops: {
            orderBy: { index: "asc" }
          }
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/routes/[id] - Delete a route
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if route exists
    const existingRoute = await db.route.findUnique({
      where: { id }
    });

    if (!existingRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Check if route has active schedules or bookings
    const [scheduleCount, bookingCount] = await Promise.all([
      db.schedule.count({ where: { routeId: id } }),
      db.booking.count({ where: { routeId: id } })
    ]);

    if (scheduleCount > 0 || bookingCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete route with active schedules or bookings" },
        { status: 400 }
      );
    }

    // Delete route and associated stops in a transaction
    await db.$transaction(async (prisma) => {
      // Delete stops first
      await prisma.stop.deleteMany({
        where: { routeId: id }
      });

      // Delete route
      await prisma.route.delete({
        where: { id }
      });
    });

    return NextResponse.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}