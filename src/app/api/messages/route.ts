import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Message } from '@/models/Message';

export async function GET(request: Request) {
  await connectDB();
  const url = new URL(request.url);
  const role = url.searchParams.get('role'); // optional filter
  const query = role ? { senderRole: role } : {};
  const msgs = await Message.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(msgs);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const { senderId, senderRole, content, type } = body;
  if (!senderId || !senderRole || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const msg = await Message.create({ senderId, senderRole, content, type: type ?? 'message' });
  return NextResponse.json({ success: true, message: msg });
}

