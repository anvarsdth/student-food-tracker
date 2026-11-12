'use strict';
import React, { useState } from 'react';
import { Shield, GraduationCap, Home, Key, UserCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (userId: string, password: string) => Promise<boolean>;
  error?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, error }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setLocalError('Please enter your Unique User ID');
      return;
    }
    setLocalError(null);
    setLoading(true);
    try {
      const ok = await onLogin(userId.trim(), password);
      if (!ok) {
        setLocalError('Invalid User ID or Password. Default password is "password123".');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoId: string) => {
    setUserId(demoId);
    setPassword('password123');
    setLoading(true);
    setLocalError(null);
    try {
      await onLogin(demoId, 'password123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Left column: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Unified ID Authentication
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign In to Your Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Log in with your system-assigned Unique ID (No email required).
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Unique User ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  placeholder="e.g. ADM01, STU101, HOM201"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-mono uppercase tracking-wide transition text-gray-900"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Format: <span className="font-semibold text-purple-600">ADM##</span> (Admin),{' '}
                <span className="font-semibold text-emerald-600">STU###</span> (Student),{' '}
                <span className="font-semibold text-amber-600">HOM###</span> (Host Home)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition text-gray-900"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Default password for all demo accounts: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">password123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              IDs are generated by the community coordinator. No public registration or email verification needed.
            </span>
          </div>
        </div>

        {/* Right column: 1-Click Role Showcase Cards */}
        <div className="md:col-span-5 bg-gradient-to-b from-gray-50 to-slate-100 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-1">
              Instant Demo Access
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Click any profile below to preview the corresponding panel immediately:
            </p>

            <div className="space-y-3">
              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleQuickLogin('ADM01')}
                className="w-full text-left p-3.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 hover:shadow-sm transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                      <Shield className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition">
                      Admin Panel
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    ADM01
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  Meal Matrix, CRUD Homes & Students, Leave Monitor & Bulk WhatsApp Alerts.
                </p>
              </button>

              {/* Student Card */}
              <button
                type="button"
                onClick={() => handleQuickLogin('STU101')}
                className="w-full text-left p-3.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-sm transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition">
                      Student Panel
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    STU101
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  Daily Breakfast, Lunch, Dinner schedule, host addresses, leave request tool.
                </p>
              </button>

              {/* Host Home Card */}
              <button
                type="button"
                onClick={() => handleQuickLogin('HOM201')}
                className="w-full text-left p-3.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <Home className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-gray-900 group-hover:text-amber-700 transition">
                      Host Home Panel
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    HOM201
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  Live expected headcounts, meal-by-meal student rosters, mark unavailability.
                </p>
              </button>

              {/* Absent Host Home Card */}
              <button
                type="button"
                onClick={() => handleQuickLogin('HOM204')}
                className="w-full text-left p-3.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 hover:shadow-sm transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                      <Home className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-gray-900 group-hover:text-rose-700 transition">
                      Unavailable Host
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    HOM204
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  Demonstrates active absence status & temporary student reassignment flow.
                </p>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/60 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Dars Meal System v2.0</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

