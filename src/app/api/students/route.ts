import { NextRequest, NextResponse } from 'next/server';
import { getAllStudents, createStudent } from '@/lib/db';

export async function GET() {
  const students = getAllStudents();
  return NextResponse.json({ students });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, phone, roomNo, hostelBlock, emergencyContact, notes, password } = body;

    if (!userId || !name || !phone || !roomNo) {
      return NextResponse.json(
        { error: 'User ID, Name, Phone, and Room Number are required' },
        { status: 400 }
      );
    }

    const newStudent = createStudent({
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

