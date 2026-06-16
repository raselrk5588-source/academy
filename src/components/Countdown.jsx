import React, { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
  const [targetDateStr, setTargetDateStr] = useState(() => {
    const saved = localStorage.getItem('academy_exam_date_v2');
    if (saved) return saved;
    return '';
  });

  useEffect(() => {
    localStorage.setItem('academy_exam_date_v2', targetDateStr);
    
    const interval = setInterval(() => {
      if (!targetDateStr) {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
        return;
      }
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div className="glass-panel" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarClock size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0 }}>পরীক্ষার কাউন্টডাউন</h2>
        </div>
        <input 
          type="date" 
          value={targetDateStr}
          onChange={(e) => setTargetDateStr(e.target.value)}
          style={{ 
            background: 'var(--border-color)', 
            border: 'none', 
            color: 'var(--text-main)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', minWidth: '80px' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary)' }}>{timeLeft.days}</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>দিন</p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', minWidth: '80px' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary)' }}>{timeLeft.hours}</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>ঘণ্টা</p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', minWidth: '80px' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary)' }}>{timeLeft.mins}</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>মিনিট</p>
        </div>
      </div>
    </div>
  );
}
