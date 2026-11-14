import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Notification } from '@/models/Notification';

export async function GET() {
  await connectDB();
  const notes = await Notification.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  await connectDB();
  const { adminId, content } = await request.json();
  if (!adminId || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const note = await Notification.create({ adminId, content });
  return NextResponse.json({ success: true, note });
}

