import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/schedules/[id] - Get a specific schedule
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

    const schedule = await db.schedule.findUnique({
      where: { id },
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            operator: true,
            type: true,
            capacity: true,
            status: true,
            currentLocation: true
          }
        },
        route: {
          select: {
            id: true,
            name: true,
            city: true,
            distanceKm: true,
            polyline: true,
            stops: {
              orderBy: { index: "asc" }
            }
          }
        }
      }
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/schedules/[id] - Update a schedule
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
      busId,
      routeId,
      departureTime,
      arrivalTime,
      daysActive,
      frequencyMin,
      baseEtaProfile
    } = body;

    // Check if schedule exists
    const existingSchedule = await db.schedule.findUnique({
      where: { id }
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Validate bus and route if provided
    if (busId) {
      const bus = await db.bus.findUnique({
        where: { id: busId }
      });
      if (!bus) {
        return NextResponse.json({ error: "Bus not found" }, { status: 404 });
      }
    }

    if (routeId) {
      const route = await db.route.findUnique({
        where: { id: routeId }
      });
      if (!route) {
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
      }
    }

    // Validate daysActive if provided
    if (daysActive !== undefined && (daysActive < 0 || daysActive > 127)) {
      return NextResponse.json(
        { error: "Invalid daysActive value" },
        { status: 400 }
      );
    }

    // Validate time logic if both times are provided
    if (departureTime && arrivalTime) {
      if (new Date(arrivalTime) <= new Date(departureTime)) {
        return NextResponse.json(
          { error: "Arrival time must be after departure time" },
          { status: 400 }
        );
      }
    }

    // Update schedule
    const updatedSchedule = await db.schedule.update({
      where: { id },
      data: {
        ...(busId && { busId }),
        ...(routeId && { routeId }),
        ...(departureTime && { departureTime: new Date(departureTime) }),
        ...(arrivalTime && { arrivalTime: new Date(arrivalTime) }),
        ...(daysActive !== undefined && { daysActive }),
        ...(frequencyMin !== undefined && { frequencyMin }),
        ...(baseEtaProfile !== undefined && { baseEtaProfile })
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

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/schedules/[id] - Delete a schedule
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

    // Check if schedule exists
    const existingSchedule = await db.schedule.findUnique({
      where: { id }
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Check if schedule has active bookings
    const bookingCount = await db.booking.count({
      where: { 
        busId: existingSchedule.busId,
        routeId: existingSchedule.routeId
      }
    });

    if (bookingCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete schedule with active bookings" },
        { status: 400 }
      );
    }

    // Delete schedule
    await db.schedule.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}