'use strict';
import React from 'react';
import { User, Role } from '@/types';
import { Utensils, Shield, GraduationCap, Home as HomeIcon, LogOut, RefreshCw, Calendar, KeyRound } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  onResetData: () => void;
  onOpenChangePassword?: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onSwitchUser,
  onResetData,
  onOpenChangePassword,
  selectedDate,
  onDateChange,
}) => {
  const getRoleBadge = (role?: Role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Panel
          </span>
        );
      case 'host':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <HomeIcon className="w-3.5 h-3.5" />
            Host Home Panel
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-900 text-lg leading-tight tracking-tight">
                  Student Meal & Host Tracker
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                  Dars Community
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Daily Meal Assignments, Leaves & Host Availability
              </p>
            </div>
          </div>

          {/* Center Date Selector & Demo Fast-Switch */}
          {user && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                <span className="font-medium mr-1.5">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer"
                />
              </div>

              {/* Quick Demo Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                <span className="text-[11px] font-medium text-gray-500 px-1.5">Switch:</span>
                <button
                  onClick={() => onSwitchUser('ADM01')}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${
                    user.userId === 'ADM01'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Switch to Admin"
                >
                  ADM01
                </button>
                <button
                  onClick={() => onSwitchUser('STU101')}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${
                    user.userId === 'STU101'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Switch to Student STU101"
                >
                  STU101
                </button>
                <button
                  onClick={() => onSwitchUser('HOM201')}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${
                    user.userId === 'HOM201'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Switch to Host Home HOM201"
                >
                  HOM201
                </button>
                <button
                  onClick={() => onSwitchUser('HOM204')}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${
                    user.userId === 'HOM204'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Switch to Absent Host HOM204"
                >
                  HOM204 (Absent)
                </button>
              </div>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">ID: {user.userId}</span>
                </div>

                {onOpenChangePassword && (
                  <button
                    onClick={onOpenChangePassword}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-gray-200 hover:border-emerald-200 transition"
                    title="Change Password"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Password</span>
                  </button>
                )}

                <button
                  onClick={onResetData}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition"
                  title="Reset Database to Default Seed Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Seed
                </button>

                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <span className="text-xs font-medium text-gray-500">Not Logged In</span>
            )}
          </div>
        </div>

        {/* Mobile Date & Switch Bar */}
        {user && (
          <div className="lg:hidden py-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-800"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Switch:</span>
              <button
                onClick={() => onSwitchUser('ADM01')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  user.userId === 'ADM01' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                ADM
              </button>
              <button
                onClick={() => onSwitchUser('STU101')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  user.userId === 'STU101' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                STU
              </button>
              <button
                onClick={() => onSwitchUser('HOM201')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  user.userId === 'HOM201' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                HOM
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

