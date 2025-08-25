import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/users - Get users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } }
      ];
    }

    if (active !== null) {
      where.updatedAt = active === "true" ? {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
      } : {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookings: true,
              notifications: {
                where: { read: false }
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
      db.user.count({ where })
    ]);

    // Get additional statistics
    const stats = await db.user.groupBy({
      by: ["role"],
      _count: {
        role: true
      }
    });

    return NextResponse.json({
      users,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      name,
      phone,
      password,
      role = "USER",
      preferences
    } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, password" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role,
        preferences: preferences || {}
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Create welcome notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: "ADMIN_MESSAGE",
        title: "Welcome to Where is My Bus",
        body: `Your account has been created successfully. Welcome aboard!`,
        metadata: {
          welcome: true,
          userId: user.id
        }
      }
    });

    return NextResponse.json({
      user,
      message: "User created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/bulk - Bulk update users
export async function PUT_bulk(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds, updates } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "updates object is required" },
        { status: 400 }
      );
    }

    // Validate updates
    const allowedUpdates = ["role", "preferences"];
    const invalidUpdates = Object.keys(updates).filter(key => !allowedUpdates.includes(key));
    
    if (invalidUpdates.length > 0) {
      return NextResponse.json(
        { error: `Invalid updates: ${invalidUpdates.join(", ")}` },
        { status: 400 }
      );
    }

    // Update users
    const result = await db.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: updates
    });

    // Create notifications for role changes
    if (updates.role) {
      await Promise.all(
        userIds.map(userId =>
          db.notification.create({
            data: {
              userId,
              type: "ADMIN_MESSAGE",
              title: "Role Updated",
              body: `Your role has been updated to ${updates.role}`,
              metadata: {
                roleChange: true,
                newRole: updates.role
              }
            }
          })
        )
      );
    }

    return NextResponse.json({
      message: "Users updated successfully",
      count: result.count,
      updatedUsers: userIds.length
    });
  } catch (error) {
    console.error("Error bulk updating users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}