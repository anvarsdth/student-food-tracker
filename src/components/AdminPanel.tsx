'use strict';
import React, { useState, useEffect } from 'react';
import {
  Student,
  Home,
  MealAssignment,
  HomeAbsence,
  StudentLeave,
  BackupAssignment,
  HomeDailySummary,
  MealType,
} from '@/types';
import {
  createWhatsAppUrl,
  buildAllLeaveMessage,
  buildDailyMealSummaryMessage,
  buildBackupReassignmentNotification,
} from '@/lib/whatsapp';
import {
  Users,
  Home as HomeIcon,
  Calendar,
  AlertTriangle,
  Send,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  Copy,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';

interface AdminPanelProps {
  selectedDate: string;
  onRefreshData?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ selectedDate, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'students' | 'homes' | 'monitor' | 'whatsapp'>('overview');

  const [students, setStudents] = useState<Student[]>([]);
  const [homes, setHomes] = useState<Home[]>([]);
  const [assignments, setAssignments] = useState<MealAssignment[]>([]);
  const [absences, setAbsences] = useState<HomeAbsence[]>([]);
  const [leaves, setLeaves] = useState<StudentLeave[]>([]);
  const [backups, setBackups] = useState<BackupAssignment[]>([]);
  const [dailySummaries, setDailySummaries] = useState<HomeDailySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Student CRUD Modal State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({
    userId: '',
    name: '',
    phone: '',
    roomNo: '',
    hostelBlock: '',
    emergencyContact: '',
    notes: '',
    password: 'password123',
  });

  // Home CRUD Modal State
  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [homeForm, setHomeForm] = useState({
    userId: '',
    hostName: '',
    phone: '',
    address: '',
    landmark: '',
    breakfastCapacity: 4,
    lunchCapacity: 4,
    dinnerCapacity: 4,
    googleMapsUrl: '',
    notes: '',
    password: 'password123',
  });

  // Quick Assignment Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<Student | null>(null);
  const [studentAssignForm, setStudentAssignForm] = useState({
    breakfastHomeId: '',
    lunchHomeId: '',
    dinnerHomeId: '',
  });

  // Backup Reassignment Modal State
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupForm, setBackupForm] = useState({
    studentId: '',
    originalHomeId: '',
    backupHomeId: '',
    mealType: 'dinner' as MealType,
    date: selectedDate,
    reason: 'Host home unavailable today',
  });

  // Bulk WhatsApp Customization State
  const [holidayReason, setHolidayReason] = useState('Campus Holiday & Community Program');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, homRes, asgnRes, absRes, lveRes, bkpRes, headRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/homes'),
        fetch('/api/assignments'),
        fetch('/api/absences'),
        fetch('/api/leaves'),
        fetch('/api/backups'),
        fetch(`/api/headcount?date=${selectedDate}`),
      ]);

      const [stuData, homData, asgnData, absData, lveData, bkpData, headData] = await Promise.all([
        stuRes.json(),
        homRes.json(),
        asgnRes.json(),
        absRes.json(),
        lveRes.json(),
        bkpRes.json(),
        headRes.json(),
      ]);

      setStudents(stuData.students || []);
      setHomes(homData.homes || []);
      setAssignments(asgnData.assignments || []);
      setAbsences(absData.absences || []);
      setLeaves(lveData.leaves || []);
      setBackups(bkpData.backups || []);
      setDailySummaries(headData.summaries || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // Student Actions
  const handleOpenStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        userId: student.userId,
        name: student.name,
        phone: student.phone,
        roomNo: student.roomNo,
        hostelBlock: student.hostelBlock || '',
        emergencyContact: student.emergencyContact || '',
        notes: student.notes || '',
        password: 'password123',
      });
    } else {
      setEditingStudent(null);
      const nextIdNum = 101 + students.length;
      setStudentForm({
        userId: `STU${nextIdNum}`,
        name: '',
        phone: '+91',
        roomNo: '',
        hostelBlock: 'Main Block',
        emergencyContact: '',
        notes: '',
        password: 'password123',
      });
    }
    setStudentModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm),
      });
    } else {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm),
      });
    }
    setStudentModalOpen(false);
    fetchData();
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student profile and all associated meal assignments?')) return;
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Home Actions
  const handleOpenHomeModal = (home?: Home) => {
    if (home) {
      setEditingHome(home);
      setHomeForm({
        userId: home.userId,
        hostName: home.hostName,
        phone: home.phone,
        address: home.address,
        landmark: home.landmark,
        breakfastCapacity: home.breakfastCapacity,
        lunchCapacity: home.lunchCapacity,
        dinnerCapacity: home.dinnerCapacity,
        googleMapsUrl: home.googleMapsUrl || '',
        notes: home.notes || '',
        password: 'password123',
      });
    } else {
      setEditingHome(null);
      const nextIdNum = 201 + homes.length;
      setHomeForm({
        userId: `HOM${nextIdNum}`,
        hostName: '',
        phone: '+91',
        address: '',
        landmark: '',
        breakfastCapacity: 4,
        lunchCapacity: 4,
        dinnerCapacity: 4,
        googleMapsUrl: '',
        notes: '',
        password: 'password123',
      });
    }
    setHomeModalOpen(true);
  };

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHome) {
      await fetch(`/api/homes/${editingHome.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeForm),
      });
    } else {
      await fetch('/api/homes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeForm),
      });
    }
    setHomeModalOpen(false);
    fetchData();
  };

  const handleDeleteHome = async (id: string) => {
    if (!confirm('Are you sure you want to delete this host home?')) return;
    await fetch(`/api/homes/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Meal Assignment Matrix Actions
  const handleOpenAssignModal = (student: Student) => {
    setSelectedStudentForAssign(student);
    const bAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'breakfast');
    const lAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'lunch');
    const dAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'dinner');

    setStudentAssignForm({
      breakfastHomeId: bAsgn ? bAsgn.homeId : (homes[0]?.id || ''),
      lunchHomeId: lAsgn ? lAsgn.homeId : (homes[0]?.id || ''),
      dinnerHomeId: dAsgn ? dAsgn.homeId : (homes[0]?.id || ''),
    });
    setAssignModalOpen(true);
  };

  const handleSaveAssignments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAssign) return;

    await Promise.all([
      fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentForAssign.id,
          mealType: 'breakfast',
          homeId: studentAssignForm.breakfastHomeId,
        }),
      }),
      fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentForAssign.id,
          mealType: 'lunch',
          homeId: studentAssignForm.lunchHomeId,
        }),
      }),
      fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentForAssign.id,
          mealType: 'dinner',
          homeId: studentAssignForm.dinnerHomeId,
        }),
      }),
    ]);

    setAssignModalOpen(false);
    fetchData();
  };

  // Backup Reassignment Actions
  const handleOpenBackupModal = (studentId?: string, originalHomeId?: string, mealType?: MealType) => {
    setBackupForm({
      studentId: studentId || (students[0]?.id || ''),
      originalHomeId: originalHomeId || (homes[0]?.id || ''),
      backupHomeId: homes.find((h) => h.id !== originalHomeId)?.id || (homes[0]?.id || ''),
      mealType: mealType || 'dinner',
      date: selectedDate,
      reason: 'Host home unavailable today',
    });
    setBackupModalOpen(true);
  };

  const handleSaveBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backupForm),
    });
    setBackupModalOpen(false);
    fetchData();
  };

  const handleDeleteBackup = async (id: string) => {
    await fetch(`/api/backups?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Cancel Leave / Absence
  const handleCancelLeave = async (id: string) => {
    await fetch(`/api/leaves?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleCancelAbsence = async (id: string) => {
    await fetch(`/api/absences?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Find host absent today
  const absentHomesToday = dailySummaries.filter((s) => s.isAbsent);

  // Find students affected by absent homes today
  const affectedStudentsToday: {
    student: Student;
    mealType: MealType;
    originalHome: Home;
    backupAssignment?: BackupAssignment;
    backupHome?: Home;
  }[] = [];

  for (const sum of absentHomesToday) {
    const home = sum.home;
    const meals: MealType[] = ['breakfast', 'lunch', 'dinner'];
    for (const m of meals) {
      const assigned = assignments.filter((a) => a.homeId === home.id && a.mealType === m && a.isActive);
      for (const asgn of assigned) {
        const student = students.find((s) => s.id === asgn.studentId);
        if (student) {
          const bkp = backups.find(
            (b) => b.studentId === student.id && b.date === selectedDate && b.mealType === m
          );
          const bkpHome = bkp ? homes.find((h) => h.id === bkp.backupHomeId) : undefined;
          affectedStudentsToday.push({
            student,
            mealType: m,
            originalHome: home,
            backupAssignment: bkp,
            backupHome: bkpHome,
          });
        }
      }
    }
  }

  // Active leaves today
  const leavesToday = leaves.filter(
    (l) => l.status === 'active' && selectedDate >= l.startDate && selectedDate <= l.endDate
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Alert Bar */}
      {absentHomesToday.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Host Home Absence Alert ({absentHomesToday.length} unavailable for {selectedDate})
                </h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  {absentHomesToday.map((h) => h.home.hostName).join(', ')} marked unavailable.{' '}
                  {affectedStudentsToday.filter((a) => !a.backupAssignment).length > 0
                    ? `${affectedStudentsToday.filter((a) => !a.backupAssignment).length} meal(s) need backup assignment!`
                    : 'All affected students have been reassigned to backup homes.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('monitor')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Manage Backup Reassignments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Subtabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white rounded-t-xl px-2 gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <Calendar className="w-4 h-4" />
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'matrix'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <Clock className="w-4 h-4" />
          Meal Assignment Matrix
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'students'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <Users className="w-4 h-4" />
          Students ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('homes')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'homes'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <HomeIcon className="w-4 h-4" />
          Host Homes ({homes.length})
        </button>

        <button
          onClick={() => setActiveTab('monitor')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'monitor'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Leave & Absence Monitor
          {affectedStudentsToday.filter((a) => !a.backupAssignment).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${activeTab === 'whatsapp'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          Bulk WhatsApp Center
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            Smart Alert
          </span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Enrolled Students
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-gray-900">{students.length}</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Active in community</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Active Host Homes
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-gray-900">{homes.length}</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <HomeIcon className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {absentHomesToday.length > 0 ? `${absentHomesToday.length} absent today` : 'All available today'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Students on Leave Today
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-gray-900">{leavesToday.length}</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Deducted from kitchen count</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Backup Reassignments
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {backups.filter((b) => b.date === selectedDate).length}
                </span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <CheckCircle className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Active for {selectedDate}</p>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
              Quick Actions:
            </span>
            <button
              onClick={() => handleOpenStudentModal()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Student
            </button>
            <button
              onClick={() => handleOpenHomeModal()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Host Home
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Clock className="w-3.5 h-3.5" />
              Manage Meal Matrix
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              WhatsApp Notice Center
            </button>
          </div>

          {/* Today's Meal Headcount Overview Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Today's Expected Headcounts ({selectedDate})
                </h3>
                <p className="text-xs text-gray-500">
                  Real-time food counts prepared per home (automatically adjusted for leaves and backup reassignments)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Open Notification Center <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dailySummaries.map((summary) => (
                <div
                  key={summary.home.id}
                  className={`p-4 rounded-xl border transition ${summary.isAbsent
                      ? 'bg-rose-50/50 border-rose-200'
                      : summary.allStudentsOnLeave
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                        {summary.home.userId}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1">
                        {summary.home.hostName}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate max-w-[200px]">
                        {summary.home.landmark}
                      </p>
                    </div>
                    {summary.isAbsent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Absent
                      </span>
                    )}
                  </div>

                  {/* Meal Counts */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <span className="text-[10px] font-medium text-gray-500 block">Breakfast</span>
                      <span className="text-base font-extrabold text-gray-900">
                        {summary.breakfast.expectedCount}
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        /{summary.home.breakfastCapacity}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-gray-50">
                      <span className="text-[10px] font-medium text-gray-500 block">Lunch</span>
                      <span className="text-base font-extrabold text-gray-900">
                        {summary.lunch.expectedCount}
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        /{summary.home.lunchCapacity}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-gray-50">
                      <span className="text-[10px] font-medium text-gray-500 block">Dinner</span>
                      <span className="text-base font-extrabold text-gray-900">
                        {summary.dinner.expectedCount}
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        /{summary.home.dinnerCapacity}
                      </span>
                    </div>
                  </div>

                  {summary.allStudentsOnLeave && (
                    <div className="mt-3 p-2 rounded bg-amber-50 text-amber-800 text-[11px] font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>All students on leave for today</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEAL ASSIGNMENT MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Meal Assignment Matrix</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assign each student to specific host homes for Breakfast, Lunch, and Dinner. (A student can eat at different homes).
                </p>
              </div>

              {/* Host Home Capacity Overview Bar */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
                <span className="font-semibold text-gray-500 whitespace-nowrap">Home Capacities:</span>
                {homes.map((h) => {
                  const bCount = assignments.filter((a) => a.homeId === h.id && a.mealType === 'breakfast').length;
                  const lCount = assignments.filter((a) => a.homeId === h.id && a.mealType === 'lunch').length;
                  const dCount = assignments.filter((a) => a.homeId === h.id && a.mealType === 'dinner').length;
                  return (
                    <div
                      key={h.id}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 whitespace-nowrap text-[11px]"
                    >
                      <span className="font-bold">{h.userId}:</span> B:{bCount}/{h.breakfastCapacity} | L:{lCount}/{h.lunchCapacity} | D:{dCount}/{h.dinnerCapacity}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Breakfast Home</th>
                    <th className="py-3 px-4">Lunch Home</th>
                    <th className="py-3 px-4">Dinner Home</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const bAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'breakfast');
                    const lAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'lunch');
                    const dAsgn = assignments.find((a) => a.studentId === student.id && a.mealType === 'dinner');

                    const bHome = bAsgn ? homes.find((h) => h.id === bAsgn.homeId) : null;
                    const lHome = lAsgn ? homes.find((h) => h.id === lAsgn.homeId) : null;
                    const dHome = dAsgn ? homes.find((h) => h.id === dAsgn.homeId) : null;

                    return (
                      <tr key={student.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {student.userId}
                            </span>
                            <div>
                              <span className="font-bold text-gray-900 block">{student.name}</span>
                              <span className="text-xs text-gray-400">{student.roomNo}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {bHome ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {bHome.userId}
                              </span>
                              <span className="text-xs text-gray-800 font-medium">{bHome.hostName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-500 font-semibold italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {lHome ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {lHome.userId}
                              </span>
                              <span className="text-xs text-gray-800 font-medium">{lHome.hostName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-500 font-semibold italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {dHome ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {dHome.userId}
                              </span>
                              <span className="text-xs text-gray-800 font-medium">{dHome.hostName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-500 font-semibold italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenAssignModal(student)}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg text-xs transition border border-purple-200 inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Assigned Homes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS DIRECTORY (CRUD) */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Enrolled Students Management</h3>
                <p className="text-xs text-gray-500">
                  Manage student profiles, system User IDs, rooms, contact numbers and WhatsApp links.
                </p>
              </div>
              <button
                onClick={() => handleOpenStudentModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                Add New Student
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const waLink = createWhatsAppUrl(student.phone, `Assalamu Alaikum ${student.name}, message from Student Care Coordinator.`);
                return (
                  <div
                    key={student.id}
                    className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xs transition bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {student.userId}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenStudentModal(student)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Edit Student"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 text-base">{student.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {student.roomNo} {student.hostelBlock ? `• ${student.hostelBlock}` : ''}
                      </p>

                      <div className="mt-3 text-xs text-gray-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="font-mono font-medium">{student.phone}</span>
                        </div>
                        {student.emergencyContact && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Emergency:</span>
                            <span className="font-mono">{student.emergencyContact}</span>
                          </div>
                        )}
                        {student.notes && (
                          <p className="text-[11px] text-gray-400 italic pt-1 border-t border-gray-100 mt-2">
                            "{student.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition border border-emerald-200"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat on WhatsApp
                      </a>
                      <button
                        onClick={() => handleOpenAssignModal(student)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                      >
                        Meal Plan →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOST HOMES DIRECTORY (CRUD) */}
      {activeTab === 'homes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Host Homes Directory</h3>
                <p className="text-xs text-gray-500">
                  Manage host home profiles, addresses, landmarks, and meal capacity limits.
                </p>
              </div>
              <button
                onClick={() => handleOpenHomeModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                Add New Host Home
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homes.map((home) => {
                const waLink = createWhatsAppUrl(home.phone, `Assalamu Alaikum ${home.hostName}, greetings from Student Meal Coordinator.`);
                return (
                  <div
                    key={home.id}
                    className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xs transition bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {home.userId}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenHomeModal(home)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Edit Host Home"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHome(home.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Host Home"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 text-base">{home.hostName}</h4>
                      <p className="text-xs text-gray-600 mt-1">{home.address}</p>
                      <div className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded font-medium">
                        🚩 Landmark: {home.landmark}
                      </div>

                      {/* Capacities */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
                        <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          <span className="text-[10px] text-amber-700 font-semibold block">Breakfast Cap</span>
                          <span className="text-sm font-bold text-gray-800">{home.breakfastCapacity}</span>
                        </div>
                        <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          <span className="text-[10px] text-amber-700 font-semibold block">Lunch Cap</span>
                          <span className="text-sm font-bold text-gray-800">{home.lunchCapacity}</span>
                        </div>
                        <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          <span className="text-[10px] text-amber-700 font-semibold block">Dinner Cap</span>
                          <span className="text-sm font-bold text-gray-800">{home.dinnerCapacity}</span>
                        </div>
                      </div>

                      {home.notes && (
                        <p className="text-[11px] text-gray-400 italic mt-3 pt-2 border-t border-gray-100">
                          "{home.notes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-500">{home.phone}</span>
                      <div className="flex items-center gap-2">
                        {home.googleMapsUrl && (
                          <a
                            href={home.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View on Google Maps"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition border border-emerald-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LEAVE & ABSENCE MONITOR + BACKUP REASSIGNMENTS */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          {/* Affected Students Backup Reassignment Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Real-Time Absence Alerts & Backup Reassignments
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Live Monitor
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  When a host marks unavailability, affected students must be reassigned to available backup homes for those dates.
                </p>
              </div>

              <button
                onClick={() => handleOpenBackupModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                Assign Backup Home
              </button>
            </div>

            {affectedStudentsToday.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Affected Student</th>
                      <th className="py-3 px-4">Meal</th>
                      <th className="py-3 px-4">Unavailable Host</th>
                      <th className="py-3 px-4">Assigned Backup Home</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {affectedStudentsToday.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                              {item.student.userId}
                            </span>
                            <span className="font-semibold text-gray-900">{item.student.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {item.mealType}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <span className="font-medium text-rose-700 block">
                              {item.originalHome.hostName} ({item.originalHome.userId})
                            </span>
                            <span className="text-rose-500 text-[11px]">Marked Unavailable</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {item.backupHome ? (
                            <div className="text-xs">
                              <span className="font-bold text-emerald-700 block">
                                {item.backupHome.hostName} ({item.backupHome.userId})
                              </span>
                              <span className="text-gray-400 text-[11px]">{item.backupHome.address}</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              Needs Backup Home!
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {item.backupAssignment ? (
                            <div className="flex items-center justify-end gap-2">
                              {/* WhatsApp Notify Link to Student */}
                              {item.backupHome && (
                                <a
                                  href={createWhatsAppUrl(
                                    item.student.phone,
                                    buildBackupReassignmentNotification({
                                      studentName: item.student.name,
                                      date: selectedDate,
                                      mealType: item.mealType,
                                      originalHostName: item.originalHome.hostName,
                                      backupHostName: item.backupHome.hostName,
                                      backupAddress: item.backupHome.address,
                                      backupLandmark: item.backupHome.landmark,
                                      backupPhone: item.backupHome.phone,
                                    })
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 inline-flex items-center gap-1"
                                  title="Send Reassignment WhatsApp Notice to Student"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Notify Student
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteBackup(item.backupAssignment!.id)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded transition"
                                title="Remove Backup"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenBackupModal(item.student.id, item.originalHome.id, item.mealType)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                            >
                              Reassign Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl text-gray-500 text-xs">
                No active host absences requiring student reassignment on {selectedDate}.
              </div>
            )}
          </div>

          {/* Sub-grid: Active Student Leaves & Host Absences History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Host Absences List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <h3 className="font-bold text-gray-900 text-base mb-1">
                Recorded Host Unavailability ({absences.length})
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Host homes closed for travel, family functions, or maintenance.
              </p>

              <div className="space-y-3">
                {absences.map((abs) => {
                  const home = homes.find((h) => h.id === abs.homeId);
                  return (
                    <div
                      key={abs.id}
                      className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {home ? home.hostName : 'Host Home'}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            {home?.userId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          📅 <span className="font-semibold">{abs.startDate}</span> to{' '}
                          <span className="font-semibold">{abs.endDate}</span> ({abs.mealType.toUpperCase()})
                        </p>
                        {abs.reason && (
                          <p className="text-[11px] text-gray-500 italic mt-1">
                            Reason: "{abs.reason}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleCancelAbsence(abs.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 hover:bg-rose-100 rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Leaves List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <h3 className="font-bold text-gray-900 text-base mb-1">
                Student Leaves Monitor ({leaves.length})
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Absences marked by students for single meals, full days, or weekends.
              </p>

              <div className="space-y-3">
                {leaves.map((lve) => {
                  const student = students.find((s) => s.id === lve.studentId);
                  const isCurrent = selectedDate >= lve.startDate && selectedDate <= lve.endDate && lve.status === 'active';
                  return (
                    <div
                      key={lve.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${isCurrent
                          ? 'border-blue-200 bg-blue-50/40'
                          : lve.status === 'cancelled'
                            ? 'border-gray-200 bg-gray-50 opacity-60'
                            : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {student ? student.name : 'Student'}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {student?.userId}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              Active Today
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          📅 <span className="font-semibold">{lve.startDate}</span> to{' '}
                          <span className="font-semibold">{lve.endDate}</span> ({lve.mealType.toUpperCase()})
                        </p>
                        {lve.reason && (
                          <p className="text-[11px] text-gray-500 italic mt-1">
                            Reason: "{lve.reason}"
                          </p>
                        )}
                      </div>
                      {lve.status === 'active' && (
                        <button
                          onClick={() => handleCancelLeave(lve.id)}
                          className="text-xs text-gray-500 hover:text-rose-600 font-semibold px-2 py-1 hover:bg-gray-100 rounded transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BULK WHATSAPP NOTIFICATION CENTER */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          {/* Smart Bulk Alert Generator Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-emerald-800 text-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Smart Bulk WhatsApp Alert Engine
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  One-Click Host Home WhatsApp Broadcaster
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
                  Send pre-formatted notifications directly to host homes with accurate headcounts.
                  Specifically, when all students are on leave (e.g. holiday or vacation), quickly alert all host homes not to prepare food.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shrink-0 text-xs space-y-2">
                <label className="block text-emerald-200 font-semibold text-[11px] uppercase tracking-wider">
                  Occasion / Holiday Note:
                </label>
                <input
                  type="text"
                  value={holidayReason}
                  onChange={(e) => setHolidayReason(e.target.value)}
                  placeholder="e.g. Campus Holiday / Eid Vacation"
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200/60 outline-none text-xs"
                />
                <p className="text-[10px] text-emerald-200/80">
                  Included in "All Students on Leave" message broadcasts.
                </p>
              </div>
            </div>
          </div>

          {/* Daily Meal Counts per Home Table with Direct WhatsApp Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Daily Host Meal Counts & Direct Dispatch ({selectedDate})
                </h3>
                <p className="text-xs text-gray-500">
                  Click the WhatsApp button beside any host to open an instant pre-formatted chat with the exact student counts.
                </p>
              </div>

              {/* Sequential / Bulk Open Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Open wa.me links in tabs
                    dailySummaries.forEach((sum, i) => {
                      setTimeout(() => {
                        const msg = sum.allStudentsOnLeave
                          ? buildAllLeaveMessage({
                            hostName: sum.home.hostName,
                            date: selectedDate,
                            reason: holidayReason,
                          })
                          : buildDailyMealSummaryMessage({
                            hostName: sum.home.hostName,
                            date: selectedDate,
                            breakfastCount: sum.breakfast.expectedCount,
                            breakfastStudents: sum.breakfast.students.filter((s) => !s.isOnLeave).map((s) => s.student.name),
                            lunchCount: sum.lunch.expectedCount,
                            lunchStudents: sum.lunch.students.filter((s) => !s.isOnLeave).map((s) => s.student.name),
                            dinnerCount: sum.dinner.expectedCount,
                            dinnerStudents: sum.dinner.students.filter((s) => !s.isOnLeave).map((s) => s.student.name),
                            leaveStudents: sum.dinner.students.filter((s) => s.isOnLeave).map((s) => s.student.name),
                          });
                        window.open(createWhatsAppUrl(sum.home.phone, msg), '_blank');
                      }, i * 400);
                    });
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                  title="Open WhatsApp chat for each host sequentially"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch All via WhatsApp
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {dailySummaries.map((summary, index) => {
                const isAllLeave = summary.allStudentsOnLeave;
                const bNames = summary.breakfast.students.filter((s) => !s.isOnLeave).map((s) => s.student.name);
                const lNames = summary.lunch.students.filter((s) => !s.isOnLeave).map((s) => s.student.name);
                const dNames = summary.dinner.students.filter((s) => !s.isOnLeave).map((s) => s.student.name);

                const leaveNames = Array.from(
                  new Set([
                    ...summary.breakfast.students.filter((s) => s.isOnLeave).map((s) => s.student.name),
                    ...summary.lunch.students.filter((s) => s.isOnLeave).map((s) => s.student.name),
                    ...summary.dinner.students.filter((s) => s.isOnLeave).map((s) => s.student.name),
                  ])
                );

                const backupNames = Array.from(
                  new Set([
                    ...summary.breakfast.students.filter((s) => s.isBackup).map((s) => `${s.student.name} (Breakfast)`),
                    ...summary.lunch.students.filter((s) => s.isBackup).map((s) => `${s.student.name} (Lunch)`),
                    ...summary.dinner.students.filter((s) => s.isBackup).map((s) => `${s.student.name} (Dinner)`),
                  ])
                );

                const preformattedMsg = isAllLeave
                  ? buildAllLeaveMessage({
                    hostName: summary.home.hostName,
                    date: selectedDate,
                    reason: holidayReason,
                  })
                  : buildDailyMealSummaryMessage({
                    hostName: summary.home.hostName,
                    date: selectedDate,
                    breakfastCount: summary.breakfast.expectedCount,
                    breakfastStudents: bNames,
                    lunchCount: summary.lunch.expectedCount,
                    lunchStudents: lNames,
                    dinnerCount: summary.dinner.expectedCount,
                    dinnerStudents: dNames,
                    leaveStudents: leaveNames,
                    backupStudents: backupNames,
                  });

                const waUrl = createWhatsAppUrl(summary.home.phone, preformattedMsg);

                return (
                  <div
                    key={summary.home.id}
                    className={`p-4 rounded-xl border transition ${isAllLeave
                        ? 'border-amber-300 bg-amber-50/40'
                        : summary.isAbsent
                          ? 'border-rose-200 bg-rose-50/40'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Host Info & Headcounts */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {summary.home.userId}
                          </span>
                          <h4 className="font-bold text-gray-900 text-base">{summary.home.hostName}</h4>
                          <span className="font-mono text-xs text-gray-400">({summary.home.phone})</span>
                          {isAllLeave && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                              All Students On Leave
                            </span>
                          )}
                          {summary.isAbsent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Host Absent
                            </span>
                          )}
                        </div>

                        {/* Headcounts Breakdown */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-1">
                          <span className="font-semibold text-gray-800">
                            Expected Today:
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                            ☕ Breakfast: <strong className="text-gray-900">{summary.breakfast.expectedCount}</strong>
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                            🍛 Lunch: <strong className="text-gray-900">{summary.lunch.expectedCount}</strong>
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                            🍲 Dinner: <strong className="text-gray-900">{summary.dinner.expectedCount}</strong>
                          </span>
                          {leaveNames.length > 0 && (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                              On Leave: {leaveNames.join(', ')}
                            </span>
                          )}
                          {backupNames.length > 0 && (
                            <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                              + Backup Reassigned: {backupNames.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: One-Click WhatsApp Action & Copy */}
                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        <button
                          onClick={() => copyToClipboard(preformattedMsg, index)}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center gap-1 transition"
                          title="Copy formatted message text"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg shadow-xs transition inline-flex items-center gap-1.5 ${isAllLeave
                              ? 'bg-amber-600 hover:bg-amber-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{isAllLeave ? 'Send "No Food Needed" Alert' : 'Send WhatsApp Update'}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT STUDENT */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">
                {editingStudent ? 'Edit Student Profile' : 'Add New Student'}
              </h3>
              <button
                onClick={() => setStudentModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Unique User ID</label>
                <input
                  type="text"
                  value={studentForm.userId}
                  onChange={(e) => setStudentForm({ ...studentForm, userId: e.target.value.toUpperCase() })}
                  disabled={!!editingStudent}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-xs uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={studentForm.roomNo}
                    onChange={(e) => setStudentForm({ ...studentForm, roomNo: e.target.value })}
                    placeholder="e.g. Room 102"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hostel Block</label>
                  <input
                    type="text"
                    value={studentForm.hostelBlock}
                    onChange={(e) => setStudentForm({ ...studentForm, hostelBlock: e.target.value })}
                    placeholder="e.g. Block A"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={studentForm.emergencyContact}
                    onChange={(e) => setStudentForm({ ...studentForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Preferences</label>
                <input
                  type="text"
                  value={studentForm.notes}
                  onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                  placeholder="e.g. Vegetarian preference or department"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT HOST HOME */}
      {homeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">
                {editingHome ? 'Edit Host Home Profile' : 'Add New Host Home'}
              </h3>
              <button
                onClick={() => setHomeModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHome} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unique User ID</label>
                  <input
                    type="text"
                    value={homeForm.userId}
                    onChange={(e) => setHomeForm({ ...homeForm, userId: e.target.value.toUpperCase() })}
                    disabled={!!editingHome}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-xs uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Host / Family Name</label>
                  <input
                    type="text"
                    value={homeForm.hostName}
                    onChange={(e) => setHomeForm({ ...homeForm, hostName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={homeForm.phone}
                  onChange={(e) => setHomeForm({ ...homeForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Address</label>
                <textarea
                  value={homeForm.address}
                  onChange={(e) => setHomeForm({ ...homeForm, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Prominent Landmark</label>
                <input
                  type="text"
                  value={homeForm.landmark}
                  onChange={(e) => setHomeForm({ ...homeForm, landmark: e.target.value })}
                  placeholder="e.g. Opposite Central Mosque Gate 2"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  required
                />
              </div>

              {/* Meal Capacities */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div>
                  <label className="block font-bold text-amber-900 mb-1 text-[11px]">Breakfast Cap</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={homeForm.breakfastCapacity}
                    onChange={(e) => setHomeForm({ ...homeForm, breakfastCapacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 text-center font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1 text-[11px]">Lunch Cap</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={homeForm.lunchCapacity}
                    onChange={(e) => setHomeForm({ ...homeForm, lunchCapacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 text-center font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1 text-[11px]">Dinner Cap</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={homeForm.dinnerCapacity}
                    onChange={(e) => setHomeForm({ ...homeForm, dinnerCapacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 text-center font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Google Maps Link (Optional)</label>
                <input
                  type="url"
                  value={homeForm.googleMapsUrl}
                  onChange={(e) => setHomeForm({ ...homeForm, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Timings</label>
                <input
                  type="text"
                  value={homeForm.notes}
                  onChange={(e) => setHomeForm({ ...homeForm, notes: e.target.value })}
                  placeholder="e.g. Lunch served strictly by 1:30 PM"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHomeModalOpen(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Host Home
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT ASSIGNED MEAL HOMES FOR STUDENT */}
      {assignModalOpen && selectedStudentForAssign && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Assign Meals: {selectedStudentForAssign.name}
                </h3>
                <span className="font-mono text-xs text-gray-500">{selectedStudentForAssign.userId}</span>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignments} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ☕ Breakfast Host Home
                </label>
                <select
                  value={studentAssignForm.breakfastHomeId}
                  onChange={(e) => setStudentAssignForm({ ...studentAssignForm, breakfastHomeId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900"
                  required
                >
                  {homes.map((h) => {
                    const count = assignments.filter((a) => a.homeId === h.id && a.mealType === 'breakfast').length;
                    return (
                      <option key={h.id} value={h.id}>
                        {h.userId} - {h.hostName} ({count}/{h.breakfastCapacity} assigned)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  🍛 Lunch Host Home
                </label>
                <select
                  value={studentAssignForm.lunchHomeId}
                  onChange={(e) => setStudentAssignForm({ ...studentAssignForm, lunchHomeId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900"
                  required
                >
                  {homes.map((h) => {
                    const count = assignments.filter((a) => a.homeId === h.id && a.mealType === 'lunch').length;
                    return (
                      <option key={h.id} value={h.id}>
                        {h.userId} - {h.hostName} ({count}/{h.lunchCapacity} assigned)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  🍲 Dinner Host Home
                </label>
                <select
                  value={studentAssignForm.dinnerHomeId}
                  onChange={(e) => setStudentAssignForm({ ...studentAssignForm, dinnerHomeId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900"
                  required
                >
                  {homes.map((h) => {
                    const count = assignments.filter((a) => a.homeId === h.id && a.mealType === 'dinner').length;
                    return (
                      <option key={h.id} value={h.id}>
                        {h.userId} - {h.hostName} ({count}/{h.dinnerCapacity} assigned)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Meal Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BACKUP REASSIGNMENT MODAL */}
      {backupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">
                Assign Temporary Backup Home
              </h3>
              <button
                onClick={() => setBackupModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBackup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Student</label>
                <select
                  value={backupForm.studentId}
                  onChange={(e) => setBackupForm({ ...backupForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.userId} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={backupForm.date}
                    onChange={(e) => setBackupForm({ ...backupForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Meal</label>
                  <select
                    value={backupForm.mealType}
                    onChange={(e) => setBackupForm({ ...backupForm, mealType: e.target.value as MealType })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs capitalize"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Original (Unavailable) Home</label>
                <select
                  value={backupForm.originalHomeId}
                  onChange={(e) => setBackupForm({ ...backupForm, originalHomeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  required
                >
                  {homes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.userId} - {h.hostName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-800 mb-1">
                  ➡️ Reassign to Temporary Backup Home
                </label>
                <select
                  value={backupForm.backupHomeId}
                  onChange={(e) => setBackupForm({ ...backupForm, backupHomeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-purple-400 bg-purple-50/40 text-xs font-semibold text-purple-900"
                  required
                >
                  {homes
                    .filter((h) => h.id !== backupForm.originalHomeId)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.userId} - {h.hostName} ({h.address})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={backupForm.reason}
                  onChange={(e) => setBackupForm({ ...backupForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBackupModalOpen(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

