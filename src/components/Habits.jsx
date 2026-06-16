import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('academy_habits_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [newHabitName, setNewHabitName] = useState('');

  const daysOfWeek = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];

  useEffect(() => {
    localStorage.setItem('academy_habits_v2', JSON.stringify(habits));
  }, [habits]);

  const toggleHabitDay = (habitId, dayIndex) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newDays = [...habit.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...habit, days: newDays };
      }
      return habit;
    }));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { 
      id: Date.now(), 
      name: newHabitName, 
      days: [false, false, false, false, false, false, false] 
    }]);
    setNewHabitName('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="glass-panel" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Target size={20} color="var(--primary)" />
        <h2 className="heading-2" style={{ margin: 0 }}>অভ্যাস ট্র্যাকার</h2>
      </div>

      <form onSubmit={addHabit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="নতুন অভ্যাস যোগ করুন..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button type="submit" className="btn btn-icon"><Plus size={20} /></button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', marginLeft: '120px', justifyContent: 'space-between', paddingRight: '24px' }}>
          {daysOfWeek.map((day, i) => (
            <span key={i} className="text-muted" style={{ fontSize: '0.8rem', width: '24px', textAlign: 'center' }}>
              {day}
            </span>
          ))}
        </div>

        {habits.length === 0 ? (
           <p className="text-muted" style={{ textAlign: 'center' }}>কোনো অভ্যাস নেই।</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '120px', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={habit.name}>
                {habit.name}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, marginRight: '0.5rem' }}>
                {habit.days.map((isDone, index) => (
                  <button
                    key={index}
                    onClick={() => toggleHabitDay(habit.id, index)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: 'none',
                      background: isDone ? 'var(--primary)' : 'var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => {
                      if (!isDone) e.currentTarget.style.background = 'rgba(128,128,128,0.3)';
                    }}
                    onMouseOut={(e) => {
                      if (!isDone) e.currentTarget.style.background = 'var(--border-color)';
                    }}
                  />
                ))}
              </div>
              <button 
                onClick={() => deleteHabit(habit.id)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.5, display: 'flex', padding: '0 4px' }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.5}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
