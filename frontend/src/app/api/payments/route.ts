import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/payments - Process payment for a booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bookingId,
      paymentMethod,
      paymentDetails
    } = body;

    // Validate required fields
    if (!bookingId || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, paymentMethod" },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: {
          where: { status: "success" }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "USER" && booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if booking is already paid
    if (booking.payments.length > 0) {
      return NextResponse.json(
        { error: "Booking is already paid" },
        { status: 400 }
      );
    }

    // Check if booking is still valid (not expired)
    if (booking.holdExpiresAt && new Date() > booking.holdExpiresAt) {
      return NextResponse.json(
        { error: "Booking hold has expired" },
        { status: 400 }
      );
    }

    // Process payment based on method
    let paymentResult;
    switch (paymentMethod) {
      case "razorpay":
        paymentResult = await processRazorpayPayment(booking, paymentDetails);
        break;
      case "wallet":
        paymentResult = await processWalletPayment(booking, paymentDetails);
        break;
      case "cod":
        paymentResult = await processCashOnDelivery(booking);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported payment method" },
          { status: 400 }
        );
    }

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        bookingId,
        provider: paymentMethod,
        amount: booking.fare,
        currency: "INR",
        status: paymentResult.status,
        orderId: paymentResult.orderId,
        paymentId: paymentResult.paymentId,
        signature: paymentResult.signature
      }
    });

    // Update booking status if payment is successful
    if (paymentResult.status === "success") {
      await db.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          holdExpiresAt: null // Clear hold expiry
        }
      });

      // Create success notification
      await db.notification.create({
        data: {
          userId: booking.userId,
          type: "PAYMENT_SUCCESS",
          title: "Payment Successful",
          body: `Payment of ₹${booking.fare} for your booking has been confirmed.`,
          metadata: {
            bookingId,
            paymentId: payment.id,
            amount: booking.fare
          }
        }
      });
    }

    return NextResponse.json({
      payment,
      bookingStatus: paymentResult.status === "success" ? "PAID" : booking.status,
      message: paymentResult.message
    }, { status: 201 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/payments - Get payment history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (session.user.role === "USER") {
      where.booking = {
        userId: session.user.id
      };
    }
    
    if (bookingId) {
      where.bookingId = bookingId;
    }
    
    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              userId: true,
              fare: true,
              status: true,
              bus: {
                select: {
                  busNumber: true,
                  operator: true
                }
              },
              route: {
                select: {
                  name: true,
                  city: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.payment.count({ where })
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Payment processing functions
async function processRazorpayPayment(booking: any, paymentDetails: any) {
  try {
    // In a real implementation, integrate with Razorpay API
    // This is a simplified version for demonstration
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate payment processing
    const isSuccessful = Math.random() > 0.1; // 90% success rate for demo

    if (isSuccessful) {
      return {
        success: true,
        status: "success",
        orderId,
        paymentId,
        signature: `razorpay_signature_${Date.now()}`,
        message: "Payment processed successfully"
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "Payment processing failed"
      };
    }
  } catch (error) {
    return {
      success: false,
      status: "failed",
      error: "Payment processing error"
    };
  }
}

async function processWalletPayment(booking: any, paymentDetails: any) {
  try {
    // Check user wallet balance (simplified)
    const user = await db.user.findUnique({
      where: { id: booking.userId },
      select: { preferences: true }
    });

    if (!user || !user.preferences || typeof user.preferences !== 'object') {
      return {
        success: false,
        status: "failed",
        error: "Wallet not found or insufficient balance"
      };
    }

    const walletBalance = (user.preferences as any).walletBalance || 0;
    
    if (walletBalance < booking.fare) {
      return {
        success: false,
        status: "failed",
        error: "Insufficient wallet balance"
      };
    }

    // Deduct from wallet
    await db.user.update({
      where: { id: booking.userId },
      data: {
        preferences: {
          ...(user.preferences as any),
          walletBalance: walletBalance - booking.fare
        }
      }
    });

    return {
      success: true,
      status: "success",
      orderId: `wallet_${Date.now()}`,
      paymentId: `wallet_${Date.now()}`,
      message: "Wallet payment processed successfully"
    };
  } catch (error) {
    return {
      success: false,
      status: "failed",
      error: "Wallet payment processing error"
    };
  }
}

async function processCashOnDelivery(booking: any) {
  try {
    // For COD, we create a pending payment record
    return {
      success: true,
      status: "pending",
      orderId: `cod_${Date.now()}`,
      paymentId: `cod_${Date.now()}`,
      message: "Cash on delivery booking confirmed"
    };
  } catch (error) {
    return {
      success: false,
      status: "failed",
      error: "COD booking failed"
    };
  }
}