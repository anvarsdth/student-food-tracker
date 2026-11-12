'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { getTodayString } from '@/lib/dateUtils';
import { Navbar } from '@/components/Navbar';
import { LoginView } from '@/components/LoginView';
import { AdminPanel } from '@/components/AdminPanel';
import { StudentPanel } from '@/components/StudentPanel';
import { HostHomePanel } from '@/components/HostHomePanel';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Restore saved session if any exists; otherwise keep user at LoginView screen
  useEffect(() => {
    const saved = localStorage.getItem('dars_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('dars_user');
      }
    }
    setInitialLoading(false);
  }, []);

  const handleLogin = async (userId: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.user) {
        showToast(data.error || 'Login failed', 'error');
        return false;
      }

      setCurrentUser(data.user);
      localStorage.setItem('dars_user', JSON.stringify(data.user));
      showToast(`Signed in as ${data.user.name} (${data.user.role.toUpperCase()})`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login error', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dars_user');
    showToast('Signed out successfully');
  };

  const handleSwitchUser = async (targetUserId: string) => {
    const pass = targetUserId === 'ADM01' ? 'anvar@9483' : 'password123';
    await handleLogin(targetUserId, pass);
  };

  const handleResetData = async () => {
    if (!confirm('Reset all demo data back to default initial seed?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        showToast('Database reset to fresh sample data!');
        // Refresh by updating selectedDate
        setSelectedDate(getTodayString());
      }
    } catch {
      showToast('Failed to reset database', 'error');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          <LoginView onLogin={handleLogin} />
        ) : (
          <>
            {currentUser.role === 'admin' && (
              <AdminPanel
                selectedDate={selectedDate}
                onRefreshData={() => setSelectedDate((d) => d)}
              />
            )}

            {currentUser.role === 'student' && (
              <StudentPanel user={currentUser} selectedDate={selectedDate} />
            )}

            {currentUser.role === 'host' && (
              <HostHomePanel user={currentUser} selectedDate={selectedDate} />
            )}
          </>
        )}
      </main>

      {/* Change Password Modal */}
      {currentUser && (
        <ChangePasswordModal
          userId={currentUser.userId}
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          onSuccess={() => showToast('Password successfully changed!')}
        />
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold transition-all transform animate-bounce bg-white border-gray-200 text-gray-800">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>
            Student Meal & Host Home Tracker (Dars Management System) • Multi-Role Community Platform
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-gray-500 hover:text-gray-800 underline transition"
            >
              Reset Seed Data
            </button>
            <span className="font-mono text-gray-400">Next.js + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
