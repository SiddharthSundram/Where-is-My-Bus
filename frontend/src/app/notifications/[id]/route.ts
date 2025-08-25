import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/notifications/[id] - Get a specific notification
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

    const notification = await db.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Check permissions
    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/[id] - Update notification (mark as read/unread)
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
    const { read } = body;

    // Check if notification exists
    const existingNotification = await db.notification.findUnique({
      where: { id }
    });

    if (!existingNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Check permissions
    if (existingNotification.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update notification
    const updatedNotification = await db.notification.update({
      where: { id },
      data: {
        ...(read !== undefined && { read })
      }
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete a notification
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

    // Check if notification exists
    const existingNotification = await db.notification.findUnique({
      where: { id }
    });

    if (!existingNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Check permissions
    if (existingNotification.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete notification
    await db.notification.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}