import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BusStatus } from "@prisma/client";

// GET /api/buses/[id] - Get a specific bus
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

    const bus = await db.bus.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            route: {
              include: {
                stops: {
                  orderBy: { index: "asc" }
                }
              }
            }
          }
        },
        telemetry: {
          orderBy: { timestamp: "desc" },
          take: 1
        }
      }
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/buses/[id] - Update a bus
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
      busNumber,
      operator,
      type,
      capacity,
      registrationNo,
      gpsDeviceId,
      status,
      currentLocation
    } = body;

    // Check if bus exists
    const existingBus = await db.bus.findUnique({
      where: { id }
    });

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Check for conflicts if updating unique fields
    if (busNumber && busNumber !== existingBus.busNumber) {
      const busWithNumber = await db.bus.findUnique({
        where: { busNumber }
      });
      if (busWithNumber) {
        return NextResponse.json(
          { error: "Bus number already exists" },
          { status: 400 }
        );
      }
    }

    if (registrationNo && registrationNo !== existingBus.registrationNo) {
      const busWithRegistration = await db.bus.findUnique({
        where: { registrationNo }
      });
      if (busWithRegistration) {
        return NextResponse.json(
          { error: "Registration number already exists" },
          { status: 400 }
        );
      }
    }

    if (gpsDeviceId && gpsDeviceId !== existingBus.gpsDeviceId) {
      const busWithGpsDevice = await db.bus.findUnique({
        where: { gpsDeviceId }
      });
      if (busWithGpsDevice) {
        return NextResponse.json(
          { error: "GPS device ID already exists" },
          { status: 400 }
        );
      }
    }

    // Update bus
    const updatedBus = await db.bus.update({
      where: { id },
      data: {
        ...(busNumber && { busNumber }),
        ...(operator && { operator }),
        ...(type && { type }),
        ...(capacity && { capacity }),
        ...(registrationNo && { registrationNo }),
        ...(gpsDeviceId && { gpsDeviceId }),
        ...(status && { status }),
        ...(currentLocation && { currentLocation })
      },
      include: {
        schedules: {
          include: {
            route: true
          }
        }
      }
    });

    return NextResponse.json(updatedBus);
  } catch (error) {
    console.error("Error updating bus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/buses/[id] - Delete a bus
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

    // Check if bus exists
    const existingBus = await db.bus.findUnique({
      where: { id }
    });

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Check if bus has active bookings or schedules
    const [bookingCount, scheduleCount] = await Promise.all([
      db.booking.count({ where: { busId: id } }),
      db.schedule.count({ where: { busId: id } })
    ]);

    if (bookingCount > 0 || scheduleCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete bus with active bookings or schedules" },
        { status: 400 }
      );
    }

    // Delete bus
    await db.bus.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}