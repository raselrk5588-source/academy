import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('academy_tasks_v2');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    localStorage.setItem('academy_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  const formatBengaliDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();
    
    let dayStr = '';
    if (isToday) dayStr = 'আজ';
    else if (isTomorrow) dayStr = 'আগামীকাল';
    else {
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      dayStr = days[date.getDay()];
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    let period = 'রাত';
    if (hours >= 5 && hours < 12) period = 'সকাল';
    else if (hours >= 12 && hours < 16) period = 'দুপুর';
    else if (hours >= 16 && hours < 18) period = 'বিকেল';
    else if (hours >= 18 && hours < 20) period = 'সন্ধ্যা';

    hours = hours % 12;
    if (hours === 0) hours = 12;
    
    const minStr = minutes.toString().padStart(2, '0');
    const toBengaliNumber = (num) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

    return `${dayStr}, ${period} ${toBengaliNumber(`${hours}:${minStr}`)}`;
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime.trim()) return;
    
    const formattedTime = formatBengaliDateTime(newTime);
    
    const types = ['assignment', 'exam', 'event'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setTasks([...tasks, { id: Date.now(), title: newTitle, time: formattedTime, type: randomType, timestamp: newTime }]);
    setNewTitle('');
    setNewTime('');
    setShowAdd(false);
  };

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCountdownText = (timestamp) => {
    if (!timestamp) return null;
    const diffMs = new Date(timestamp) - new Date();
    if (diffMs <= 0) return 'সময় শেষ!';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const toBengali = (num) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
    
    let parts = [];
    if (diffDays > 0) parts.push(`${toBengali(diffDays)} দিন`);
    if (diffHrs > 0) parts.push(`${toBengali(diffHrs)} ঘণ্টা`);
    if (diffMins > 0) parts.push(`${toBengali(diffMins)} মি.`);
    
    if (parts.length === 0) return '১ মিনিটের কম বাকি!';
    return parts.slice(0, 2).join(' ') + ' বাকি';
  };

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0 }}>আসন্ন কাজ</h2>
        </div>
        <button 
          className="btn btn-icon" 
          onClick={() => setShowAdd(!showAdd)}
          style={{ width: '30px', height: '30px', background: showAdd ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)' }}
        >
          {showAdd ? <X size={16} color="#ef4444" /> : <Plus size={16} />}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <input type="text" className="input-field" placeholder="কাজের নাম (যেমন: গণিত অ্যাসাইনমেন্ট)" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
          <input type="datetime-local" className="input-field" value={newTime} onChange={e => setNewTime(e.target.value)} required style={{ color: newTime ? 'var(--text-main)' : 'var(--text-muted)' }} />
          <button type="submit" className="btn" style={{ background: 'var(--success)', marginTop: '0.5rem' }}>যুক্ত করুন</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.length > 0 ? tasks.map((item) => (
          <div key={item.id} style={{
            padding: '0.6rem 0.75rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: `3px solid ${
              item.type === 'assignment' ? 'var(--warning)' : 
              item.type === 'exam' ? 'var(--danger)' : 'var(--info)'
            }`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '0.9rem' }}>{item.title}</h4>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>{item.time}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.timestamp && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: 'var(--primary)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  ⏳ {getCountdownText(item.timestamp)}
                </span>
              )}
              <button 
                onClick={() => deleteTask(item.id)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7, padding: '4px' }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem', padding: '1rem 0' }}>কোনো কাজ যুক্ত করা নেই</p>
        )}
      </div>
    </div>
  );
}
