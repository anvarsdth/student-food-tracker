'use strict';
import React, { useState, useEffect } from 'react';
import { User, Student, StudentDailySchedule, StudentLeave, LeaveMealType, MealType } from '@/types';
import { createWhatsAppUrl, buildStudentLeaveNotification } from '@/lib/whatsapp';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Navigation,
  ExternalLink,
  Coffee,
  Sun,
  Moon,
  Info,
  X,
} from 'lucide-react';

interface StudentPanelProps {
  user: User;
  selectedDate: string;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({ user, selectedDate }) => {
  const [schedule, setSchedule] = useState<StudentDailySchedule | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [myLeaves, setMyLeaves] = useState<StudentLeave[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave Request Modal State
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: selectedDate,
    endDate: selectedDate,
    mealType: 'all' as LeaveMealType,
    reason: '',
  });

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const stuRes = await fetch('/api/students');
      const stuData = await stuRes.json();
      const student = (stuData.students || []).find(
        (s: Student) => s.userId.toUpperCase() === user.userId.toUpperCase()
      );

      if (student) {
        setStudentProfile(student);

        const schedRes = await fetch(`/api/student-schedule?studentId=${student.id}&date=${selectedDate}`);
        const schedData = await schedRes.json();
        setSchedule(schedData.schedule || null);

        const lveRes = await fetch(`/api/leaves?studentId=${student.id}`);
        const lveData = await lveRes.json();
        setMyLeaves(lveData.leaves || []);
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [selectedDate, user.userId]);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;

    await fetch('/api/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentProfile.id,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        mealType: leaveForm.mealType,
        reason: leaveForm.reason || 'Personal / Travel',
      }),
    });

    setLeaveModalOpen(false);
    fetchStudentData();
  };

  const handleCancelLeave = async (leaveId: string) => {
    if (!confirm('Are you sure you want to cancel this leave?')) return;
    await fetch(`/api/leaves?id=${leaveId}`, { method: 'DELETE' });
    fetchStudentData();
  };

  const getMealTimeWindow = (mealType: MealType) => {
    switch (mealType) {
      case 'breakfast':
        return '7:30 AM – 9:00 AM';
      case 'lunch':
        return '12:30 PM – 2:30 PM';
      case 'dinner':
        return '7:30 PM – 9:30 PM';
    }
  };

  const [activeMealTab, setActiveMealTab] = useState<MealType>('breakfast');

  const renderMealCard = (mealType: MealType, title: string, icon: React.ReactNode) => {
    if (!schedule) return null;
    const meal = schedule.meals[mealType];
    const targetHome = (schedule.meals[mealType] as any)?.homeId;
    return (
      <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setActiveMealTab(mealType)}>
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="ml-2 font-bold">{title}</h3>
        </div>
        <p className="text-sm">{getMealTimeWindow(mealType)}</p>
        <p className="mt-2">{meal?.items?.join(', ') || 'No items scheduled'}</p>
        {targetHome && <p className="text-xs text-gray-500 mt-1">Home: {targetHome}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">Hello, {studentProfile?.name || user.name}</h2>
        <p className="mt-2">{studentProfile?.className || ''}</p>
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMealCard('breakfast', 'Breakfast', <Coffee className="w-5 h-5" />)}
        {renderMealCard('lunch', 'Lunch', <Sun className="w-5 h-5" />)}
        {renderMealCard('dinner', 'Dinner', <Moon className="w-5 h-5" />)}
      </div>

      {/* Leave List */}
      <div>
        <h3 className="font-bold text-lg mb-2">Your Leave Requests</h3>
        {myLeaves.length ? (
          <ul className="space-y-2">
            {myLeaves.map((leave) => (
              <li key={leave.id} className="border p-3 rounded">
                <p>{leave.mealType} from {leave.startDate} to {leave.endDate}</p>
                <p className="text-sm text-gray-600">{leave.reason}</p>
                {leave.status === 'active' && (
                  <button
                    onClick={() => handleCancelLeave(leave.id)}
                    className="mt-1 text-xs text-rose-600 hover:underline"
                  >
                    Cancel Leave
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No leave requests.</p>
        )}
        <button
          onClick={() => setLeaveModalOpen(true)}
          className="mt-4 px-3 py-1 bg-emerald-600 text-white rounded"
        >
          + New Leave
        </button>
      </div>

      {/* Leave Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 shadow max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Submit Leave Request</h4>
              <button onClick={() => setLeaveModalOpen(false)} className="text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="border p-2 rounded" required />
                <input type="date" value={leaveForm.endDate}
                  min={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="border p-2 rounded" required />
              </div>
              <select
                value={leaveForm.mealType}
                onChange={(e) => setLeaveForm({ ...leaveForm, mealType: e.target.value as LeaveMealType })}
                className="w-full border p-2 rounded"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              <input
                type="text"
                placeholder="Reason (optional)"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setLeaveModalOpen(false)} className="px-3 py-1 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
