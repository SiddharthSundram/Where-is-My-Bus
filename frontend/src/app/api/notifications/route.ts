import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: session.user.id };
    
    if (type) {
      where.type = type;
    }
    
    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.notification.count({ where }),
      db.notification.count({
        where: {
          userId: session.user.id,
          read: false
        }
      })
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      type,
      title,
      body: notificationBody,
      metadata,
      broadcast // Send to all users
    } = body;

    // Validate required fields
    if (!type || !title || !notificationBody) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, body" },
        { status: 400 }
      );
    }

    let notifications = [];

    if (broadcast) {
      // Broadcast to all users
      const users = await db.user.findMany({
        select: { id: true }
      });

      notifications = await Promise.all(
        users.map(user => 
          db.notification.create({
            data: {
              userId: user.id,
              type,
              title,
              body,
              metadata
            }
          })
        )
      );
    } else if (userId) {
      // Send to specific user
      const user = await db.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const notification = await db.notification.create({
        data: {
          userId,
          type,
          title,
          body: notificationBody,
          metadata
        }
      });

      notifications = [notification];
    } else {
      return NextResponse.json(
        { error: "Either userId or broadcast must be specified" },
        { status: 400 }
      );
    }

    // Emit real-time notifications via WebSocket if available
    try {
      // WebSocket integration would go here
      console.log('Real-time notification sent:', notifications.length);
    } catch (socketError) {
      console.log('WebSocket not available for real-time notifications');
    }

    return NextResponse.json({
      message: "Notifications created successfully",
      count: notifications.length,
      notifications
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/mark-read - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, markAll } = body;

    let result;

    if (markAll) {
      // Mark all notifications as read for this user
      result = await db.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: {
          read: true
        }
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      result = await db.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: session.user.id
        },
        data: {
          read: true
        }
      });
    } else {
      return NextResponse.json(
        { error: "Either notificationIds or markAll must be specified" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Notifications marked as read",
      count: result.count
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}