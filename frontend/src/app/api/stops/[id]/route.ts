import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/stops/[id] - Get a specific stop
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

    const stop = await db.stop.findUnique({
      where: { id },
      include: {
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

    if (!stop) {
      return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    }

    return NextResponse.json(stop);
  } catch (error) {
    console.error("Error fetching stop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/stops/[id] - Update a stop
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
      name,
      index,
      location
    } = body;

    // Check if stop exists
    const existingStop = await db.stop.findUnique({
      where: { id }
    });

    if (!existingStop) {
      return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    }

    // Check for index conflicts if updating
    if (index !== undefined && index !== existingStop.index) {
      const conflictingStop = await db.stop.findFirst({
        where: {
          routeId: existingStop.routeId,
          index,
          id: { not: id }
        }
      });

      if (conflictingStop) {
        return NextResponse.json(
          { error: "Stop index already exists for this route" },
          { status: 400 }
        );
      }
    }

    // Update stop
    const updatedStop = await db.stop.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(index !== undefined && { index }),
        ...(location && { 
          location: {
            type: "Point",
            coordinates: location.coordinates
          }
        })
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

    return NextResponse.json(updatedStop);
  } catch (error) {
    console.error("Error updating stop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/stops/[id] - Delete a stop
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

    // Check if stop exists
    const existingStop = await db.stop.findUnique({
      where: { id }
    });

    if (!existingStop) {
      return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    }

    // Delete stop
    await db.stop.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Stop deleted successfully" });
  } catch (error) {
    console.error("Error deleting stop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}