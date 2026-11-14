'use client';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dars_user');
    if (saved) setUser(JSON.parse(saved));
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
  };

  const sendNotification = async () => {
    if (!newNote.trim()) return alert('Message cannot be empty');
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: user?.userId || 'admin', content: newNote }),
    });
    setNewNote('');
    fetchNotifications();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {user?.role === 'admin' && (
        <div className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter notification..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={sendNotification}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Send Notification
          </button>
        </div>
      )}
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n._id || n.id} className="p-2 border rounded">
            <p className="text-sm text-gray-600">{new Date(n.createdAt).toLocaleString()}</p>
            <p>{n.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
