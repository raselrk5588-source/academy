"use client";
import React, { useState, useEffect } from 'react';
import {
  BookOpen, 
  Settings, 
  User,
  Calendar,
  LayoutDashboard,
  Box,
  HelpCircle
} from 'lucide-react';

import { useAuth } from './bdapps-auth/context/AuthContext';
import LoginModal from './bdapps-auth/components/LoginModal';
import dynamic from 'next/dynamic';

const Pomodoro = dynamic(() => import('../components/Pomodoro'), { ssr: false });
const TodoList = dynamic(() => import('../components/TodoList'), { ssr: false });
const Habits = dynamic(() => import('../components/Habits'), { ssr: false });
const Notes = dynamic(() => import('../components/Notes'), { ssr: false });
const Streak = dynamic(() => import('../components/Streak'), { ssr: false });
const Weather = dynamic(() => import('../components/Weather'), { ssr: false });
const UpcomingTasks = dynamic(() => import('../components/UpcomingTasks'), { ssr: false });
const MusicPlayer = dynamic(() => import('../components/MusicPlayer'), { ssr: false });
const Countdown = dynamic(() => import('../components/Countdown'), { ssr: false });
const Flashcards = dynamic(() => import('../components/Flashcards'), { ssr: false });
const ExpenseTracker = dynamic(() => import('../components/ExpenseTracker'), { ssr: false });
const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });
import { Brain as QuizIcon } from 'lucide-react';

function App() {
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studyTimeStr, setStudyTimeStr] = useState('০ ঘণ্টা ০ মিনিট');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false);
  
  // Wrap useAuth in try/catch or ensure it's client-side safe
  const { isAuthenticated, logout, userMobile } = useAuth();

  useEffect(() => {
    // Reset daily study time if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('academy_study_date');
    if (storedDate !== today) {
      localStorage.setItem('academy_daily_study_seconds', 0);
      localStorage.setItem('academy_study_date', today);
    }

    const updateStudyTime = () => {
      const seconds = Number(localStorage.getItem('academy_daily_study_seconds') || 0);
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      
      const toBengaliNumber = (num) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
      
      if (hours > 0) {
        setStudyTimeStr(`${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(mins)} মিনিট`);
      } else {
        setStudyTimeStr(`${toBengaliNumber(mins)} মিনিট`);
      }
    };

    updateStudyTime();
    window.addEventListener('studyTimeUpdated', updateStudyTime);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('শুভ সকাল');
    else if (hour < 18) setGreeting('শুভ দুপুর');
    else setGreeting('শুভ সন্ধ্যা');

    return () => window.removeEventListener('studyTimeUpdated', updateStudyTime);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('academy_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('academy_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleTabChange = (tab) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      setShowProfileModal(true);
    }
  };

  const handleInteractionCapture = (e) => {
    // If not authenticated, block the interaction and show login modal
    // We only block if the target is interactive like button, input, select
    const target = e.target;
    const isInteractive = target.closest('button, input, select, textarea, [role="button"], a');
    
    if (isInteractive && !isAuthenticated) {
      e.stopPropagation();
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="app-container">
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => setIsLoginModalOpen(false)} 
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowProfileModal(false)}>
          <div className="glass-panel animate-scale-up" style={{ width: '350px', background: 'var(--bg-color)', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>আপনার প্রোফাইল</h2>
              <button 
                onClick={() => { setShowProfileModal(false); setConfirmUnsubscribe(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ display: 'inline-flex', padding: '1rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', marginBottom: '1rem' }}>
              <User size={48} color="white" />
            </div>
            
            <p className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>লগইন করা নম্বর:</p>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '2rem' }}>{userMobile || 'অজ্ঞাত'}</h3>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              {!confirmUnsubscribe ? (
                <button 
                  className="btn" 
                  style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
                  onClick={() => setConfirmUnsubscribe(true)}
                >
                  আনসাবস্ক্রাইব করুন
                </button>
              ) : (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                    আপনি কি নিশ্চিত আনসাবস্ক্রাইব করবেন?
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn" 
                      style={{ flex: 1, background: 'rgba(128,128,128,0.2)', color: 'var(--text-main)' }}
                      onClick={() => setConfirmUnsubscribe(false)}
                    >
                      না, বাতিল
                    </button>
                    <button 
                      className="btn" 
                      style={{ flex: 1, background: '#ef4444', color: 'white' }}
                      onClick={async () => {
                        try {
                          const res = await fetch('/bdapps-auth/api/unsubscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_mobile: userMobile })
                          });
                          
                          const data = await res.json();
                          
                          if (data.success) {
                            // Clear all user profile data
                            Object.keys(localStorage).forEach(key => {
                              if (key.startsWith('academy_')) {
                                localStorage.removeItem(key);
                              }
                            });
                            
                            logout();
                            setShowProfileModal(false);
                            setConfirmUnsubscribe(false);
                            alert("সফলভাবে আনসাবস্ক্রাইব করা হয়েছে।");
                          } else {
                            alert("আনসাবস্ক্রাইব করতে সমস্যা হচ্ছে: " + (data.statusDetail || data.error || 'অজানা ত্রুটি'));
                          }
                        } catch (e) {
                          console.error("Unsubscribe error", e);
                          alert("আনসাবস্ক্রাইব করতে সমস্যা হচ্ছে। ইন্টারনেট কানেকশন চেক করুন।");
                        }
                      }}
                    >
                      হ্যাঁ, নিশ্চিত
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowSettings(false)}>
          <div className="glass-panel" style={{ width: '400px', background: 'var(--bg-color)', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0 }}>সেটিংস</h2>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>থিম পরিবর্তন</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn" 
                  style={{ flex: 1, background: theme === 'light' ? 'var(--primary)' : 'rgba(128,128,128,0.2)', color: theme === 'light' ? 'white' : 'var(--text-main)' }}
                  onClick={() => toggleTheme('light')}
                >
                  লাইট মোড ☀️
                </button>
                <button 
                  className="btn" 
                  style={{ flex: 1, background: theme === 'dark' ? 'var(--primary)' : 'rgba(128,128,128,0.2)', color: theme === 'dark' ? 'white' : 'var(--text-main)' }}
                  onClick={() => toggleTheme('dark')}
                >
                  ডার্ক মোড 🌙
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & FAQ Modal */}
      {showHelpModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowHelpModal(false)}>
          <div className="glass-panel animate-scale-up" style={{ width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', background: 'var(--bg-color)', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="heading-2" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle size={24} color="var(--primary)" /> হেল্প এবং FAQ</h2>
              <button 
                onClick={() => setShowHelpModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>কীভাবে সাবস্ক্রাইব করবেন?</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                ১. অ্যাপের যেকোনো ফিচারে ক্লিক করলে লগইন স্ক্রিন আসবে।<br/>
                ২. সেখানে আপনার রবি বা এয়ারটেল নম্বর দিন।<br/>
                ৩. মোবাইলে আসা OTP কোডটি দিয়ে ভেরিফাই করলেই আপনার সাবস্ক্রিপশন চালু হয়ে যাবে।<br/>
                <br/>
                <strong>সাবস্ক্রিপশন চার্জ:</strong> ২.৭৮ টাকা/দিন (Vat+SC+SD সহ)।
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>কীভাবে আনসাবস্ক্রাইব করবেন?</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                ১. উপরে ডানদিকের "প্রোফাইল" (User) আইকনে ক্লিক করুন।<br/>
                ২. "আনসাবস্ক্রাইব করুন" বাটনে ক্লিক করে নিশ্চিত করুন।<br/>
                ৩. সাথে সাথে আপনার সাবস্ক্রিপশন বাতিল হয়ে যাবে এবং কোনো চার্জ কাটা হবে না।
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>সচরাচর জিজ্ঞাসা (FAQ)</h3>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>প্রশ্ন: অ্যাপটি কাদের জন্য?</p>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>উত্তর: এই একাডেমি অ্যাপটি মূলত ছাত্র-ছাত্রীদের পড়াশোনার সময়কে গুছিয়ে রাখার জন্য তৈরি করা হয়েছে।</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>প্রশ্ন: আমার নম্বর কি নিরাপদ?</p>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>উত্তর: হ্যাঁ, আমরা BDApps এর অফিসিয়াল সিকিউর API ব্যবহার করি।</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}>
            <BookOpen size={24} color="white" />
          </div>
          <div>
            <h1 className="heading-2" style={{ margin: 0 }}>একাডেমি</h1>
            {isAuthenticated && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                আজকের পড়াশোনা: {studyTimeStr}
              </p>
            )}
          </div>
        </div>
        
        <div className="app-header-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ marginRight: '1rem', textAlign: 'right' }} className="hide-on-mobile">
            <p style={{ margin: 0, fontWeight: 600 }}>{greeting}, শিক্ষার্থী!</p>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
              {new Date().toLocaleDateString('bn-BD', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {!isAuthenticated && (
            <button className="btn btn-icon" onClick={() => setShowHelpModal(true)}>
              <HelpCircle size={20} color="var(--text-main)" />
            </button>
          )}
          <button className="btn btn-icon" onClick={() => setShowSettings(true)}><Settings size={20} color="var(--text-main)" /></button>
          <div 
            onClick={handleProfileClick}
            style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isAuthenticated ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <User size={20} color="white" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem 0', maxWidth: '1400px', margin: '0 auto', justifyContent: 'center' }}>
        <button 
          onClick={() => handleTabChange('dashboard')}
          style={{
            background: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--border-color)',
            color: activeTab === 'dashboard' ? 'white' : 'var(--text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'var(--transition)'
          }}
        >
          <LayoutDashboard size={18} /> ড্যাশবোর্ড
        </button>
        <button 
          onClick={() => handleTabChange('tools')}
          style={{
            background: activeTab === 'tools' ? 'var(--primary)' : 'var(--border-color)',
            color: activeTab === 'tools' ? 'white' : 'var(--text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'var(--transition)'
          }}
        >
          <Box size={18} /> টুলস
        </button>
        <button 
          onClick={() => handleTabChange('quiz')}
          style={{
            background: activeTab === 'quiz' ? 'var(--primary)' : 'var(--border-color)',
            color: activeTab === 'quiz' ? 'white' : 'var(--text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'var(--transition)'
          }}
        >
          <QuizIcon size={18} /> কুইজ
        </button>
      </div>

      <main className="dashboard-grid" onClickCapture={handleInteractionCapture} style={{ display: activeTab === 'dashboard' ? '' : 'none' }}>
        {/* Left Column (Timer & Habits) */}
        <div className="dashboard-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Pomodoro />
          <Habits />
        </div>

        {/* Center Column (Todos & Notes) */}
        <div className="dashboard-col-center" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TodoList />
          <Notes />
        </div>

        {/* Right Column (Streak, Weather, Schedule) */}
        <div className="dashboard-col-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Streak />
          <Weather />
          
          <UpcomingTasks />
        </div>
      </main>

      <main className="dashboard-grid" onClickCapture={handleInteractionCapture} style={{ display: activeTab === 'tools' ? '' : 'none' }}>
        <div className="dashboard-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <MusicPlayer />
          <Countdown />
        </div>
        <div className="dashboard-col-center" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Flashcards />
        </div>
        <div className="dashboard-col-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ExpenseTracker />
        </div>
      </main>

      <main className="dashboard-grid" onClickCapture={handleInteractionCapture} style={{ display: activeTab === 'quiz' ? 'block' : 'none' }}>
        <Quiz />
      </main>
    </div>
  );
}

export default App;
