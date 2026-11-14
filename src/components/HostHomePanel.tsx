'use strict';
import { useState, useEffect } from 'react';

import { User, Home, HomeDailySummary, HomeAbsence, LeaveMealType, MealType } from '@/types';
import { createWhatsAppUrl } from '@/lib/whatsapp';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Users,
  Coffee,
  Sun,
  Moon,
  Home as HomeIcon,
  X,
  Sparkles,
} from 'lucide-react';

interface HostHomePanelProps {
  user: User;
  selectedDate: string;
}

export const HostHomePanel: React.FC<HostHomePanelProps> = ({ user, selectedDate }) => {
  const [summary, setSummary] = useState<HomeDailySummary | null>(null);
  const [homeProfile, setHomeProfile] = useState<Home | null>(null);
  const [myAbsences, setMyAbsences] = useState<HomeAbsence[]>([]);
  const [activeMealTab, setActiveMealTab] = useState<MealType>('lunch');
  const [loading, setLoading] = useState(true);

  // Absence Modal State
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({
    startDate: selectedDate,
    endDate: selectedDate,
    mealType: 'all' as LeaveMealType,
    reason: '',
  });

  const fetchHostData = async () => {
    setLoading(true);
    try {
      const homRes = await fetch('/api/homes');
      const homData = await homRes.json();
      const home = (homData.homes || []).find((h: Home) => h.userId.toUpperCase() === user.userId.toUpperCase());
      if (home) {
        setHomeProfile(home);
        const sumRes = await fetch(`/api/headcount?date=${selectedDate}&homeId=${home.id}`);
        const sumData = await sumRes.json();
        setSummary(sumData.summary || null);
        const absRes = await fetch(`/api/absences?homeId=${home.id}`);
        const absData = await absRes.json();
        setMyAbsences(absData.absences || []);
      }
    } catch (err) {
      console.error('Failed to load host data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostData();
  }, [selectedDate, user.userId]);

  const handleSubmitAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeProfile) return;
    await fetch('/api/absences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homeId: homeProfile.id,
        startDate: absenceForm.startDate,
        endDate: absenceForm.endDate,
        mealType: absenceForm.mealType,
        reason: absenceForm.reason || 'Family ceremony / Out of station',
      }),
    });
    setAbsenceModalOpen(false);
    fetchHostData();
  };

  const handleCancelAbsence = async (absenceId: string) => {
    if (!confirm('Are you sure you want to cancel this unavailability notice and resume serving meals?')) return;
    await fetch(`/api/absences?id=${absenceId}`, { method: 'DELETE' });
    fetchHostData();
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Kitchen Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-600/60 text-amber-100 border border-amber-500 mb-2">
              <HomeIcon className="w-3.5 h-3.5" />
              Host Family Home
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Assalamu Alaikum, {homeProfile?.hostName || user.name}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              {homeProfile?.address} • ID: <span className="font-mono font-bold">{user.userId}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAbsenceForm({ startDate: selectedDate, endDate: selectedDate, mealType: 'all', reason: '' });
                setAbsenceModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Mark Unavailability (Closed)
            </button>
          </div>
        </div>
      </div>

      {/* Unavailability Alert Banner if Host is Currently Absent */}
      {summary?.isAbsent && (
        <div className="p-4 rounded-xl border-2 border-rose-400 bg-rose-50 text-rose-900 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">
                  Your Kitchen is Marked UNAVAILABLE for {selectedDate}
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  {summary.absenceReason ? `Reason: "${summary.absenceReason}". ` : ''}
                  Admin has been notified to reassign your students to temporary backup homes.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const activeAbs = myAbsences.find((a) => selectedDate >= a.startDate && selectedDate <= a.endDate);
                if (activeAbs) handleCancelAbsence(activeAbs.id);
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold self-start sm:self-auto shadow-xs transition"
            >
              Resume Food Preparation (Cancel Absence)
            </button>
          </div>
        </div>
      )}

      {/* If All Students are on leave today */}
      {summary?.allStudentsOnLeave && !summary?.isAbsent && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">
                Good News: All assigned students are on leave for {selectedDate}!
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                No food preparation is needed today. Enjoy your day!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expected Headcounts 3 Stat Cards */}
      {summary && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Today's Expected Headcount ({selectedDate})
              </h3>
              <p className="text-xs text-gray-500">
                Number of portions to cook for each meal (leaves already deducted)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Breakfast Stat */}
            <div onClick={() => setActiveMealTab('breakfast')} className={`p-5 rounded-2xl border cursor-pointer transition ${activeMealTab === 'breakfast'
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-200 shadow-md'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-amber-600" /> Breakfast
                </span>
                <span className="text-xs font-semibold text-gray-400">7:30 AM – 9:00 AM</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">{summary.breakfast.expectedCount}</span>
                <span className="text-sm font-semibold text-gray-500">meals to prepare</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Total Assigned: {summary.breakfast.baseCount}</span>
                <span className="text-amber-700 font-semibold">Capacity: {homeProfile?.breakfastCapacity}</span>
              </div>
            </div>
            {/* Lunch Stat */}
            <div onClick={() => setActiveMealTab('lunch')} className={`p-5 rounded-2xl border cursor-pointer transition ${activeMealTab === 'lunch'
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-200 shadow-md'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-600" /> Lunch
                </span>
                <span className="text-xs font-semibold text-gray-400">12:30 PM – 2:30 PM</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">{summary.lunch.expectedCount}</span>
                <span className="text-sm font-semibold text-gray-500">meals to prepare</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Total Assigned: {summary.lunch.baseCount}</span>
                <span className="text-amber-700 font-semibold">Capacity: {homeProfile?.lunchCapacity}</span>
              </div>
            </div>
            {/* Dinner Stat */}
            <div onClick={() => setActiveMealTab('dinner')} className={`p-5 rounded-2xl border cursor-pointer transition ${activeMealTab === 'dinner'
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-200 shadow-md'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-amber-600" /> Dinner
                </span>
                <span className="text-xs font-semibold text-gray-400">7:30 PM – 9:30 PM</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">{summary.dinner.expectedCount}</span>
                <span className="text-sm font-semibold text-gray-500">meals to prepare</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Total Assigned: {summary.dinner.baseCount}</span>
                <span className="text-amber-700 font-semibold">Capacity: {homeProfile?.dinnerCapacity}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal-by-Meal Student Roster */}
      {summary && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Student Roster for <span className="capitalize text-amber-700">{activeMealTab}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {summary[activeMealTab].expectedCount} Coming
              </span>
              <p className="text-xs text-gray-500">Detailed list of students expected to arrive at your home.</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button onClick={() => setActiveMealTab('breakfast')} className={`px-3 py-1.5 ${activeMealTab === 'breakfast' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                Breakfast ({summary.breakfast.expectedCount})
              </button>
              <button onClick={() => setActiveMealTab('lunch')} className={`px-3 py-1.5 ${activeMealTab === 'lunch' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                Lunch ({summary.lunch.expectedCount})
              </button>
              <button onClick={() => setActiveMealTab('dinner')} className={`px-3 py-1.5 ${activeMealTab === 'dinner' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                Dinner ({summary.dinner.expectedCount})
              </button>
            </div>
          </div>
          {summary[activeMealTab].students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary[activeMealTab].students.map((item, idx) => {
                const st = item.student;
                const waLink = createWhatsAppUrl(
                  st.phone,
                  `Assalamu Alaikum ${st.name}, this is ${homeProfile?.hostName} regarding ${activeMealTab} today.`
                );
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between ${item.isOnLeave ? 'border-gray-200 bg-gray-50 opacity-60' : item.isBackup ? 'border-purple-300 bg-purple-50/40 shadow-xs' : 'border-gray-200 bg-white hover:border-amber-300 shadow-xs'}`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">{st.userId}</span>
                        {item.isOnLeave ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">ON LEAVE (DO NOT COOK)</span>
                        ) : item.isBackup ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Backup Reassigned</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Regular Student</span>
                        )}
                      </div>
                      <h4 className={`font-bold text-sm ${item.isOnLeave ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {st.name}
                      </h4>
                      <p className="text-xs text-gray-500">{st.roomNo}</p>
                      {item.isBackup && item.originalHome && (
                        <p className="text-[11px] text-purple-700 mt-2 font-medium">
                          🔄 Reassigned from {item.originalHome.hostName}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-500">{st.phone}</span>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
              No students assigned for {activeMealTab}.
            </div>
          )}
        </div>
      )}

      {/* Host Home Absence History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">My Recorded Unavailabilities</h3>
            <p className="text-xs text-gray-500">Dates when your home cannot prepare food.</p>
          </div>
          <button
            onClick={() => {
              setAbsenceForm({ startDate: selectedDate, endDate: selectedDate, mealType: 'all', reason: '' });
              setAbsenceModalOpen(true);
            }}
            className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition"
          >
            + New Unavailability Notice
          </button>
        </div>
        {myAbsences.length > 0 ? (
          <div className="space-y-3">
            {myAbsences.map((abs) => {
              const isCurrent = selectedDate >= abs.startDate && selectedDate <= abs.endDate;
              return (
                <div
                  key={abs.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isCurrent ? 'border-rose-300 bg-rose-50/50' : 'border-gray-200 bg-white'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        📅 {abs.startDate} {abs.startDate !== abs.endDate ? `to ${abs.endDate}` : ''}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {abs.mealType === 'all' ? 'All Meals' : abs.mealType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{abs.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancelAbsence(abs.id)}
                      className="px-2 py-0.5 bg-red-600 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No recorded absences.</p>
        )}
      </div>
    </div>
  );
};
