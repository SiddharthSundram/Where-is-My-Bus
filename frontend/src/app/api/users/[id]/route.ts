import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/users/[id] - Get a specific user
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

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          select: {
            id: true,
            status: true,
            fare: true,
            createdAt: true,
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
          },
          take: 10,
          orderBy: {
            createdAt: "desc"
          }
        },
        notifications: {
          select: {
            id: true,
            type: true,
            title: true,
            body: true,
            read: true,
            createdAt: true
          },
          take: 10,
          orderBy: {
            createdAt: "desc"
          }
        },
        _count: {
          select: {
            bookings: true,
            notifications: {
              where: { read: false }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "USER" && session.user.id !== id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
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
    const {
      name,
      phone,
      email,
      password,
      role,
      preferences
    } = body;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "USER" && session.user.id !== id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Regular users can only update their own profile
    const isOwnProfile = session.user.id === id;
    const isAdmin = session.user.role === "ADMIN";

    // Validate updates based on permissions
    const updates: any = {};
    
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined && (isAdmin || isOwnProfile)) {
      // Check if email is already taken by another user
      const emailUser = await db.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });
      
      if (emailUser) {
        return NextResponse.json(
          { error: "Email already taken by another user" },
          { status: 400 }
        );
      }
      
      updates.email = email;
    }
    
    if (password !== undefined && (isAdmin || isOwnProfile)) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }
      updates.passwordHash = await bcrypt.hash(password, 12);
    }
    
    if (role !== undefined && isAdmin) {
      updates.role = role;
    }
    
    if (preferences !== undefined && (isAdmin || isOwnProfile)) {
      updates.preferences = {
        ...(existingUser.preferences as any || {}),
        ...preferences
      };
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        preferences: true,
        updatedAt: true
      }
    });

    // Create notification for significant changes
    if (role !== undefined && role !== existingUser.role) {
      await db.notification.create({
        data: {
          userId: id,
          type: "ADMIN_MESSAGE",
          title: "Role Updated",
          body: `Your role has been changed to ${role}`,
          metadata: {
            roleChange: true,
            oldRole: existingUser.role,
            newRole: role
          }
        }
      });
    }

    return NextResponse.json({
      user: updatedUser,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
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

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deletion of users with active bookings
    if (existingUser._count.bookings > 0) {
      return NextResponse.json(
        { error: "Cannot delete user with active bookings" },
        { status: 400 }
      );
    }

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/deactivate - Deactivate a user
export async function POST_deactivate(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deactivate user by clearing password hash
    await db.user.update({
      where: { id },
      data: {
        passwordHash: null,
        preferences: {
          ...(existingUser.preferences as any || {}),
          deactivated: true,
          deactivatedAt: new Date().toISOString(),
          deactivatedBy: session.user.id
        }
      }
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: id,
        type: "ADMIN_MESSAGE",
        title: "Account Deactivated",
        body: "Your account has been deactivated by an administrator.",
        metadata: {
          deactivation: true,
          deactivatedBy: session.user.id
        }
      }
    });

    return NextResponse.json({
      message: "User deactivated successfully"
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/activate - Activate a user
export async function POST_activate(
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
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to activate user" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Activate user by setting password hash
    const passwordHash = await bcrypt.hash(password, 12);
    
    await db.user.update({
      where: { id },
      data: {
        passwordHash,
        preferences: {
          ...(existingUser.preferences as any || {}),
          deactivated: false,
          activatedAt: new Date().toISOString(),
          activatedBy: session.user.id
        }
      }
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: id,
        type: "ADMIN_MESSAGE",
        title: "Account Activated",
        body: "Your account has been activated. You can now log in.",
        metadata: {
          activation: true,
          activatedBy: session.user.id
        }
      }
    });

    return NextResponse.json({
      message: "User activated successfully"
    });
  } catch (error) {
    console.error("Error activating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}