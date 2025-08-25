import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

// GET /api/bookings/[id] - Get a specific booking
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

    const booking = await db.booking.findUnique({
      where: { id },
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
            type: true,
            capacity: true,
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
        },
        fromStop: {
          select: {
            id: true,
            name: true,
            index: true,
            location: true
          }
        },
        toStop: {
          select: {
            id: true,
            name: true,
            index: true,
            location: true
          }
        },
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            currency: true,
            provider: true,
            orderId: true,
            paymentId: true,
            createdAt: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user has permission to view this booking
    if (session.user.role === "USER" && booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Calculate real-time ETA if booking is active
    let realTimeETA = null;
    if (booking.status === BookingStatus.PAID) {
      // Get latest bus location
      const latestTelemetry = await db.telemetry.findFirst({
        where: { busId: booking.busId },
        orderBy: { timestamp: "desc" }
      });

      if (latestTelemetry && booking.route.stops.length > 0) {
        // Simplified ETA calculation
        const fromStopIndex = booking.route.stops.findIndex(stop => stop.id === booking.fromStopId);
        const toStopIndex = booking.route.stops.findIndex(stop => stop.id === booking.toStopId);
        
        if (fromStopIndex !== -1 && toStopIndex !== -1) {
          // Calculate estimated arrival time (simplified)
          const baseETA = 15; // Base 15 minutes
          const delayAdjustment = latestTelemetry.delayMin || 0;
          realTimeETA = Math.max(0, baseETA + delayAdjustment) as number | null;
        }
      }
    }

    return NextResponse.json({
      ...booking,
      realTimeETA
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update a booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, seatCount } = body;

    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "USER" && existingBooking.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      "PENDING": ["PAID", "CANCELLED"],
      "PAID": ["CANCELLED", "REFUNDED"],
      "CANCELLED": [],
      "REFUNDED": []
    };

    if (status && !validTransitions[existingBooking.status].includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${existingBooking.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(seatCount !== undefined && { seatCount })
      },
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            operator: true
          }
        },
        route: {
          select: {
            id: true,
            name: true,
            city: true
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

    // Create notification for status change
    if (status && status !== existingBooking.status) {
      let notificationTitle = "";
      let notificationBody = "";

      switch (status) {
        case "PAID":
          notificationTitle = "Payment Confirmed";
          notificationBody = `Your booking for ${existingBooking.routeId} has been confirmed.`;
          break;
        case "CANCELLED":
          notificationTitle = "Booking Cancelled";
          notificationBody = `Your booking has been cancelled.`;
          break;
        case "REFUNDED":
          notificationTitle = "Refund Processed";
          notificationBody = `Your refund for booking ${existingBooking.id} has been processed.`;
          break;
      }

      await db.notification.create({
        data: {
          userId: existingBooking.userId,
          type: status === "PAID" ? "PAYMENT_SUCCESS" : "BOOKING_CONFIRMATION",
          title: notificationTitle,
          body: notificationBody,
          metadata: {
            bookingId: id,
            newStatus: status
          }
        }
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id },
      include: {
        payments: {
          where: { status: "success" }
        }
      }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "USER" && existingBooking.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (existingBooking.status === "CANCELLED" || existingBooking.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Check if booking has successful payments (would need refund process)
    if (existingBooking.payments.length > 0) {
      return NextResponse.json(
        { error: "Cannot cancel booking with successful payments. Please request refund." },
        { status: 400 }
      );
    }

    // Cancel booking
    const cancelledBooking = await db.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED
      }
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: existingBooking.userId,
        type: "BOOKING_CONFIRMATION",
        title: "Booking Cancelled",
        body: `Your booking has been cancelled successfully.`,
        metadata: {
          bookingId: id
        }
      }
    });

    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking: cancelledBooking
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}