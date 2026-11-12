import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllStudents, createStudent } from '@/lib/mongoService';

export async function GET() {
  try {
    await connectDB();
    const students = await getAllStudents();
    return NextResponse.json({ students });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, name, phone, roomNo, hostelBlock, emergencyContact, notes, password } = body;

    if (!userId || !name || !phone || !roomNo) {
      return NextResponse.json(
        { error: 'User ID, Name, Phone, and Room Number are required' },
        { status: 400 }
      );
    }

    const newStudent = await createStudent({
      userId,
      name,
      phone,
      roomNo,
      hostelBlock,
      emergencyContact,
      status: 'active',
      notes,
      password: password || 'password123',
    });

    return NextResponse.json({ student: newStudent }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}
