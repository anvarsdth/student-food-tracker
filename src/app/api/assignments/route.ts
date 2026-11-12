import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllMealAssignments, setMealAssignment, bulkUpdateAssignments } from '@/lib/mongoService';
import { MealType } from '@/types';

export async function GET() {
  try {
    await connectDB();
    const assignments = await getAllMealAssignments();
    return NextResponse.json({ assignments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Check if bulk update
    if (body.bulk && Array.isArray(body.assignments)) {
      await bulkUpdateAssignments(body.assignments);
      const updatedAssignments = await getAllMealAssignments();
      return NextResponse.json({ success: true, assignments: updatedAssignments });
    }

    const { studentId, mealType, homeId } = body;
    if (!studentId || !mealType || !homeId) {
      return NextResponse.json(
        { error: 'studentId, mealType, and homeId are required' },
        { status: 400 }
      );
    }

    const assignment = await setMealAssignment(studentId, mealType as MealType, homeId);
    return NextResponse.json({ assignment });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to set assignment' },
      { status: 500 }
    );
  }
}
