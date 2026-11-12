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
      // Find student profile matching user
      const stuRes = await fetch('/api/students');
      const stuData = await stuRes.json();
      const student = (stuData.students || []).find(
        (s: Student) => s.userId.toUpperCase() === user.userId.toUpperCase()
      );

      if (student) {
        setStudentProfile(student);

        // Fetch schedule for student
        const schedRes = await fetch(`/api/student-schedule?studentId=${student.id}&date=${selectedDate}`);
        const schedData = await schedRes.json();
        setSchedule(schedData.schedule || null);

        // Fetch student's leaves
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

  const renderMealCard = (mealType: MealType, title: string, icon: React.ReactNode) => {
    if (!schedule) return null;
    const meal = schedule.meals[mealType];
    const targetHome = meal.backupHome || meal.home;
    const isReassigned = !!meal.backupHome;
    const isHostAbsent = meal.isHostAbsent;
    const isOnLeave = meal.isOnLeave;

    const waText = `Assalamu Alaikum ${targetHome?.hostName || 'Host'}, this is ${studentProfile?.name} (${user.userId}) regarding ${title} today.`;
    const waUrl = targetHome ? createWhatsAppUrl(targetHome.phone, waText) : '#';

    return (
      <div
        className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
          isOnLeave
            ? 'bg-gray-50/80 border-gray-200 opacity-70'
            : isReassigned
            ? 'bg-purple-50/50 border-purple-300 shadow-sm'
            : isHostAbsent
            ? 'bg-rose-50/60 border-rose-300 shadow-sm'
            : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md'
        }`}
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                {icon}
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-base">{title}</h4>
                <span className="text-xs text-gray-500 font-medium">
                  {getMealTimeWindow(mealType)}
                </span>
              </div>
            </div>

            {/* Status Badges */}
            {isOnLeave ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                You are on Leave
              </span>
            ) : isReassigned ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                Backup Home Assigned
              </span>
            ) : isHostAbsent ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                Host Unavailable
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Confirmed
              </span>
            )}
          </div>

          {/* Absence Alert Notice */}
          {isHostAbsent && !isReassigned && !isOnLeave && (
            <div className="mb-3 p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="block">Host Unavailable!</strong>
                <span>
                  Your regular host ({meal.home?.hostName}) is absent today. The Admin has been notified to assign a backup home.
                </span>
              </div>
            </div>
          )}

          {/* Reassigned Notice */}
          {isReassigned && !isOnLeave && (
            <div className="mb-3 p-3 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
              <div>
                <strong className="block">Temporary Reassignment Active:</strong>
                <span>
                  Regular host ({meal.home?.hostName}) is away. Please eat at this temporary backup home today.
                </span>
              </div>
            </div>
          )}

          {/* Host Details */}
          {targetHome ? (
            <div className="space-y-2 mt-2">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {isReassigned ? 'Backup Host Family' : 'Host Home'}
                </span>
                <span className="text-base font-bold text-gray-900">
                  {targetHome.hostName}
                </span>
                <span className="ml-2 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {targetHome.userId}
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-gray-600">
                <MapPin className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p>{targetHome.address}</p>
                  <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                    🚩 Landmark: {targetHome.landmark}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{targetHome.phone}</span>
              </div>

              {targetHome.notes && (
                <p className="text-[11px] text-gray-400 italic pt-1 border-t border-gray-100">
                  "{targetHome.notes}"
                </p>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-gray-400 italic">
              No host home assigned yet for this meal.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {targetHome && !isOnLeave && (
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Host</span>
            </a>

            <a
              href={`tel:${targetHome.phone}`}
              className="p-2 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
              title="Call Host Phone"
            >
              <Phone className="w-4 h-4" />
            </a>

            {targetHome.googleMapsUrl && (
              <a
                href={targetHome.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-gray-200 hover:border-gray-300 rounded-xl text-blue-600 hover:bg-blue-50 transition"
                title="Directions on Google Maps"
              >
                <Navigation className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-100 border border-emerald-600 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Active Enrolled Student
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Assalamu Alaikum, {studentProfile?.name || user.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {studentProfile?.roomNo} • ID: <span className="font-mono font-bold">{user.userId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLeaveForm({
                  startDate: selectedDate,
                  endDate: selectedDate,
                  mealType: 'all',
                  reason: '',
                });
                setLeaveModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Request Leave / Skip Meal
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Host Availability Alert Banner (if any host is absent) */}
      {schedule &&
        (schedule.meals.breakfast.isHostAbsent ||
          schedule.meals.lunch.isHostAbsent ||
          schedule.meals.dinner.isHostAbsent) && (
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">
                  Notice: Host Home Availability Update for {selectedDate}
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  One or more of your assigned host homes are unavailable today.
                  {schedule.meals.breakfast.backupHome ||
                  schedule.meals.lunch.backupHome ||
                  schedule.meals.dinner.backupHome
                    ? ' Admin has assigned temporary backup homes below.'
                    : ' Please check with coordinator if a meal has not yet been reassigned.'}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Daily Meal Schedule Cards (Breakfast, Lunch, Dinner) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Today's Meal Schedule ({selectedDate})
            </h3>
            <p className="text-xs text-gray-500">
              Host home locations, timings, and direct WhatsApp contact for each meal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderMealCard('breakfast', 'Breakfast', <Coffee className="w-5 h-5" />)}
          {renderMealCard('lunch', 'Lunch', <Sun className="w-5 h-5" />)}
          {renderMealCard('dinner', 'Dinner', <Moon className="w-5 h-5" />)}
        </div>
      </div>

      {/* My Submitted Leaves & History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">My Leave Requests</h3>
            <p className="text-xs text-gray-500">
              Absences you have submitted. When you take leave, your host home's headcount is automatically reduced.
            </p>
          </div>
          <button
            onClick={() => {
              setLeaveForm({
                startDate: selectedDate,
                endDate: selectedDate,
                mealType: 'all',
                reason: '',
              });
              setLeaveModalOpen(true);
            }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition"
          >
            + New Leave
          </button>
        </div>

        {myLeaves.length > 0 ? (
          <div className="space-y-3">
            {myLeaves.map((leave) => {
              const isCurrent =
                selectedDate >= leave.startDate && selectedDate <= leave.endDate && leave.status === 'active';
              return (
                <div
                  key={leave.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : leave.status === 'cancelled'
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        📅 {leave.startDate} {leave.startDate !== leave.endDate ? `to ${leave.endDate}` : ''}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {leave.mealType === 'all' ? 'Full Day' : leave.mealType}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Today
                        </span>
                      )}
                      {leave.status === 'cancelled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600">
                          Cancelled
                        </span>
                      )}
                    </div>
                    {leave.reason && (
                      <p className="text-xs text-gray-500 mt-1">"{leave.reason}"</p>
                    )}
                  </div>

                  {leave.status === 'active' && (
                    <button
                      onClick={() => handleCancelLeave(leave.id)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 font-semibold rounded-lg border border-rose-200 transition"
                    >
                      Cancel Leave
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-xl">
            No leave requests recorded. Click "+ New Leave" if you plan to skip a meal or travel home.
          </p>
        )}
      </div>

      {/* LEAVE REQUEST MODAL */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Submit Leave Request</h3>
                <p className="text-xs text-gray-500">
                  Notify your host homes and admin that you won't be eating.
                </p>
              </div>
              <button
                onClick={() => setLeaveModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    min={leaveForm.startDate}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Meals Affected
                </label>
                <select
                  value={leaveForm.mealType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, mealType: e.target.value as LeaveMealType })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-900"
                >
                  <option value="all">Full Day (All Meals: Breakfast, Lunch, Dinner)</option>
                  <option value="breakfast">Breakfast Only</option>
                  <option value="lunch">Lunch Only</option>
                  <option value="dinner">Dinner Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="e.g. Going home for the weekend / fast / exam"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm & Submit Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

