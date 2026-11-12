import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'User ID, current password, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: 'New password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    const normalizedId = userId.trim().toUpperCase();
    const user = await User.findOne({ userId: normalizedId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate current password
    if (user.password !== currentPassword.trim()) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    // Update password
    user.password = newPassword.trim();
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}
