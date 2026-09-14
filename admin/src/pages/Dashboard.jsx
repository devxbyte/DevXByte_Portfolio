import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiCode, HiMail, HiCollection, HiEye } from 'react-icons/hi';

const Dashboard = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, skills: 0 });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, msgRes, unreadRes, skillRes] = await Promise.allSettled([
          api.get('/projects', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') }),
          api.get('/messages'),
          api.get('/messages/unread'),
          api.get('/skills', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') })
        ]);

        setStats({
          projects: projRes.status === 'fulfilled' ? projRes.value.data.length : 0,
          messages: msgRes.status === 'fulfilled' ? msgRes.value.data.length : 0,
          unread: unreadRes.status === 'fulfilled' ? unreadRes.value.data.count : 0,
          skills: skillRes.status === 'fulfilled' ? skillRes.value.data.length : 0
        });

        if (msgRes.status === 'fulfilled') {
          setRecentMessages(msgRes.value.data.slice(0, 5));
        }
      } catch (err) {
        console.log('Stats fetch error', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your portfolio</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><HiCode /></div>
          <div className="stat-value">{stats.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><HiMail /></div>
          <div className="stat-value">{stats.messages}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><HiEye /></div>
          <div className="stat-value">{stats.unread}</div>
          <div className="stat-label">Unread Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiCollection /></div>
          <div className="stat-value">{stats.skills}</div>
          <div className="stat-label">Skills</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Messages</h3>
        </div>
        {recentMessages.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No messages yet</p>
        ) : (
          <div className="message-list">
            {recentMessages.map(msg => (
              <div key={msg._id} className={`message-item ${!msg.read ? 'unread' : ''}`}>
                <div className="message-header">
                  <span className="message-sender">{msg.name}</span>
                  <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="message-subject">{msg.subject || 'No subject'}</div>
                <div className="message-preview">{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
