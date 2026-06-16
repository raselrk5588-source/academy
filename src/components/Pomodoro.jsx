import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Settings, X, Save } from 'lucide-react';

export default function Pomodoro() {
  const [studyDuration, setStudyDuration] = useState(() => Number(localStorage.getItem('pomodoro_studyDuration')) || 25);
  const [breakDuration, setBreakDuration] = useState(() => Number(localStorage.getItem('pomodoro_breakDuration')) || 5);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('pomodoro_viewMode') || 'study');
  const [showSettings, setShowSettings] = useState(false);

  const [studyTimeLeft, setStudyTimeLeft] = useState(() => {
    const initial = Number(localStorage.getItem('pomodoro_studyTimeLeft'));
    return isNaN(initial) ? (Number(localStorage.getItem('pomodoro_studyDuration')) || 25) * 60 : initial;
  });

  const [breakTimeLeft, setBreakTimeLeft] = useState(() => {
    const initial = Number(localStorage.getItem('pomodoro_breakTimeLeft'));
    return isNaN(initial) ? (Number(localStorage.getItem('pomodoro_breakDuration')) || 5) * 60 : initial;
  });

  const [runningTimer, setRunningTimer] = useState(() => {
    const running = localStorage.getItem('pomodoro_runningTimer'); // 'study', 'break', or 'null'
    if (running !== 'study' && running !== 'break') return null;

    const lastTick = Number(localStorage.getItem('pomodoro_lastTick')) || Date.now();
    const elapsed = Math.floor((Date.now() - lastTick) / 1000);
    
    if (elapsed > 0) {
      if (running === 'study') {
        const currentLeft = Number(localStorage.getItem('pomodoro_studyTimeLeft')) || (Number(localStorage.getItem('pomodoro_studyDuration')) || 25) * 60;
        const newLeft = currentLeft - elapsed;
        
        const actualElapsed = newLeft >= 0 ? elapsed : currentLeft;
        if (actualElapsed > 0) {
          const currentTotal = Number(localStorage.getItem('academy_daily_study_seconds') || 0);
          localStorage.setItem('academy_daily_study_seconds', currentTotal + actualElapsed);
          setTimeout(() => window.dispatchEvent(new Event('studyTimeUpdated')), 100);
        }

        if (newLeft <= 0) {
          localStorage.setItem('pomodoro_studyTimeLeft', (Number(localStorage.getItem('pomodoro_studyDuration')) || 25) * 60);
          localStorage.setItem('pomodoro_runningTimer', 'break');
          localStorage.setItem('pomodoro_viewMode', 'break');
          return 'break'; // Switches to break
        } else {
          localStorage.setItem('pomodoro_studyTimeLeft', newLeft);
        }
      } else if (running === 'break') {
        const currentLeft = Number(localStorage.getItem('pomodoro_breakTimeLeft')) || (Number(localStorage.getItem('pomodoro_breakDuration')) || 5) * 60;
        const newLeft = currentLeft - elapsed;
        
        if (newLeft <= 0) {
          localStorage.setItem('pomodoro_breakTimeLeft', (Number(localStorage.getItem('pomodoro_breakDuration')) || 5) * 60);
          localStorage.setItem('pomodoro_runningTimer', 'study');
          localStorage.setItem('pomodoro_viewMode', 'study');
          return 'study'; // Switches to study
        } else {
          localStorage.setItem('pomodoro_breakTimeLeft', newLeft);
        }
      }
    }
    return running;
  });

  // Sync state after mount if needed
  useEffect(() => {
    const sLeft = Number(localStorage.getItem('pomodoro_studyTimeLeft'));
    if (!isNaN(sLeft) && sLeft !== studyTimeLeft) setStudyTimeLeft(sLeft);
    
    const bLeft = Number(localStorage.getItem('pomodoro_breakTimeLeft'));
    if (!isNaN(bLeft) && bLeft !== breakTimeLeft) setBreakTimeLeft(bLeft);
    
    const vMode = localStorage.getItem('pomodoro_viewMode');
    if (vMode && vMode !== viewMode) setViewMode(vMode);
  }, []);

  useEffect(() => {
    let interval = null;
    if (runningTimer) {
      interval = setInterval(() => {
        if (runningTimer === 'study') {
          setStudyTimeLeft((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              handleTimerComplete('study');
              return studyDuration * 60;
            }
            localStorage.setItem('pomodoro_studyTimeLeft', next);
            localStorage.setItem('pomodoro_lastTick', Date.now());
            return next;
          });
          
          const currentTotal = Number(localStorage.getItem('academy_daily_study_seconds') || 0);
          localStorage.setItem('academy_daily_study_seconds', currentTotal + 1);
          if ((currentTotal + 1) % 60 === 0) {
             window.dispatchEvent(new Event('studyTimeUpdated'));
          }

        } else if (runningTimer === 'break') {
          setBreakTimeLeft((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              handleTimerComplete('break');
              return breakDuration * 60;
            }
            localStorage.setItem('pomodoro_breakTimeLeft', next);
            localStorage.setItem('pomodoro_lastTick', Date.now());
            return next;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningTimer, studyDuration, breakDuration]);

  const handleTimerComplete = (completedTimer) => {
    new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
    const nextTimer = completedTimer === 'study' ? 'break' : 'study';
    setRunningTimer(nextTimer);
    setViewMode(nextTimer);
    localStorage.setItem('pomodoro_runningTimer', nextTimer);
    localStorage.setItem('pomodoro_viewMode', nextTimer);
    if (completedTimer === 'study') {
      localStorage.setItem('pomodoro_studyTimeLeft', studyDuration * 60);
    } else {
      localStorage.setItem('pomodoro_breakTimeLeft', breakDuration * 60);
    }
    localStorage.setItem('pomodoro_lastTick', Date.now());
  };

  const toggleTimer = () => {
    if (runningTimer === viewMode) {
      // Pause
      setRunningTimer(null);
      localStorage.setItem('pomodoro_runningTimer', 'null');
    } else {
      // Start currently viewed timer
      setRunningTimer(viewMode);
      localStorage.setItem('pomodoro_runningTimer', viewMode);
      localStorage.setItem('pomodoro_lastTick', Date.now());
    }
  };
  
  const resetTimer = () => {
    if (runningTimer === viewMode) {
      setRunningTimer(null);
      localStorage.setItem('pomodoro_runningTimer', 'null');
    }
    if (viewMode === 'study') {
      setStudyTimeLeft(studyDuration * 60);
      localStorage.setItem('pomodoro_studyTimeLeft', studyDuration * 60);
    } else {
      setBreakTimeLeft(breakDuration * 60);
      localStorage.setItem('pomodoro_breakTimeLeft', breakDuration * 60);
    }
  };

  const changeViewMode = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem('pomodoro_viewMode', newMode);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = viewMode === 'study' ? studyDuration * 60 : breakDuration * 60;
  const currentTimeLeft = viewMode === 'study' ? studyTimeLeft : breakTimeLeft;
  const progress = totalTime > 0 ? ((totalTime - currentTimeLeft) / totalTime) * 100 : 0;
  const isViewRunning = runningTimer === viewMode;

  const saveSettings = () => {
    setShowSettings(false);
    localStorage.setItem('pomodoro_studyDuration', studyDuration);
    localStorage.setItem('pomodoro_breakDuration', breakDuration);
    // Don't auto reset on save to prevent losing progress, unless they want to
  };

  return (
    <div className="glass-panel" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Timer size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0 }}>পোমোডোরো</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button 
              style={{ 
                background: viewMode === 'study' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'study' ? 'white' : 'var(--text-main)', border: 'none', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
              }}
              onClick={() => changeViewMode('study')}
            >পড়াশোনা</button>
            <button 
              style={{ 
                background: viewMode === 'break' ? 'var(--success)' : 'transparent',
                color: viewMode === 'break' ? 'white' : 'var(--text-main)', border: 'none', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
              }}
              onClick={() => changeViewMode('break')}
            >বিরতি</button>
          </div>
          <button className="btn btn-icon" onClick={() => setShowSettings(!showSettings)} style={{ background: 'transparent', width: '32px', height: '32px' }}>
            <Settings size={18} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>সেটিংস</h3>
            <button className="btn btn-icon" onClick={() => setShowSettings(false)} style={{ background: 'transparent', width: '24px', height: '24px' }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>পড়াশোনা (মিনিট)</label>
              <input type="number" className="input-field" value={studyDuration} onChange={e => setStudyDuration(Number(e.target.value))} min="1" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>বিরতি (মিনিট)</label>
              <input type="number" className="input-field" value={breakDuration} onChange={e => setBreakDuration(Number(e.target.value))} min="1" />
            </div>
          </div>
          <button className="btn" style={{ width: '100%', background: 'var(--success)' }} onClick={saveSettings}>
            <Save size={16} /> সেভ করুন
          </button>
        </div>
      ) : (
        <>
          <div className="pomodoro-ring" style={{ 
            position: 'relative', 
            width: '200px', 
            height: '200px', 
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `conic-gradient(${viewMode === 'study' ? 'var(--primary)' : 'var(--success)'} ${progress}%, rgba(128,128,128,0.2) ${progress}%)`
          }}>
            <div className="pomodoro-circle" style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              background: 'var(--surface)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="pomodoro-text" style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'monospace' }}>
                {formatTime(currentTimeLeft)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn" onClick={toggleTimer} style={{ width: '120px' }}>
              {isViewRunning ? <><Pause size={18}/> থামান</> : <><Play size={18}/> শুরু</>}
            </button>
            <button className="btn btn-icon" onClick={resetTimer} style={{ background: 'var(--border-color)', color: 'var(--text-main)' }}>
              <RotateCcw size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
