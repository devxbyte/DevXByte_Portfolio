import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiTrash, HiEye } from 'react-icons/hi';

const Messages = () => {
  const { api } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchMessages = () => { api.get('/messages').then(r => setMessages(r.data)).catch(() => {}); };
  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try { await api.put(`/messages/${msg._id}/read`); fetchMessages(); } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/messages/${id}`); toast.success('Deleted'); setSelected(null); fetchMessages(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Messages</h1><p className="page-subtitle">Contact form submissions</p></div>
      </div>

      <div className={`message-grid ${selected ? 'has-selected' : ''}`}>
        <div className="message-list">
          {messages.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No messages yet</p>}
          {messages.map(msg => (
            <div key={msg._id} className={`message-item ${!msg.read ? 'unread' : ''}`} onClick={() => markAsRead(msg)}>
              <div className="message-header">
                <span className="message-sender">{msg.name} {!msg.read && <span className="badge badge-info">New</span>}</span>
                <span className="message-date">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div className="message-subject">{msg.subject || 'No subject'}</div>
              <div className="message-preview">{msg.message}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Message Details</h3>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected._id)}><HiTrash /> Delete</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px' }}><strong>From:</strong> {selected.name}</p>
              <p style={{ fontSize: '14px' }}><strong>Email:</strong> {selected.email}</p>
              <p style={{ fontSize: '14px' }}><strong>Subject:</strong> {selected.subject || 'N/A'}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              {selected.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
