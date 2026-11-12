import { NextRequest, NextResponse } from 'next/server';
import { updateStudent, deleteStudent, getStudentById } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = updateStudent(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ student: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteStudent(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete student' },
      { status: 500 }
    );
  }
}

