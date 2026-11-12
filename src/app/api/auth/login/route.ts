import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { findUserByCredentials, getStudentByUserId, getHomeByUserId } from '@/lib/mongoService';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and Password are required' },
        { status: 400 }
      );
    }

    const user = await findUserByCredentials(userId, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid User ID or Password' },
        { status: 401 }
      );
    }

    let profile: any = null;
    if (user.role === 'student') {
      profile = await getStudentByUserId(user.userId);
    } else if (user.role === 'host') {
      profile = await getHomeByUserId(user.userId);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
      profile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
