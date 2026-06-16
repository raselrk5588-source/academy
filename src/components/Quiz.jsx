import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, XCircle, RefreshCw, Play, Timer, ArrowLeft, BookOpen, FlaskConical, Landmark, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const categoriesInfo = {
  general: { id: 'general', name: 'সাধারণ জ্ঞান', icon: BookOpen, timeLimit: 300 },
  science: { id: 'science', name: 'বিজ্ঞান ও প্রযুক্তি', icon: FlaskConical, timeLimit: 300 },
  history: { id: 'history', name: 'ইতিহাস ও ঐতিহ্য', icon: Landmark, timeLimit: 300 }
};

export default function Quiz() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Leaderboard states
  const [playerName, setPlayerName] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);

  // Load player name from local storage on mount and fetch leaderboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('academy_player_name');
      if (savedName) {
        setPlayerName(savedName);
      }
    }
    fetchLeaderboard();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !showScore) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && isStarted && !showScore) {
      handleQuizEnd();
    }
  }, [timeLeft, isStarted, showScore]);

  // Handle Quiz End
  const handleQuizEnd = async () => {
    setShowScore(true);
    
    // Save to Database / Local fallback
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName || 'অজ্ঞাত স্টুডেন্ট',
          score,
          totalQuestions: activeQuestions.length,
          category: selectedCategory
        })
      });
      
      if (!res.ok) throw new Error('Failed to save score to DB');
    } catch (error) {
      console.warn("DB save failed, using local fallback:", error);
      // Local fallback leaderboard
      const localLeaderboard = JSON.parse(localStorage.getItem('academy_local_leaderboard') || '[]');
      localLeaderboard.push({
        playerName: playerName || 'অজ্ঞাত স্টুডেন্ট',
        score,
        totalQuestions: activeQuestions.length,
        category: selectedCategory,
        createdAt: new Date().toISOString()
      });
      // Sort and keep top 50
      localLeaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem('academy_local_leaderboard', JSON.stringify(localLeaderboard.slice(0, 50)));
    }

    // Refresh Leaderboard Data
    fetchLeaderboard();
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaderboardData(data.leaderboard);
    } catch (error) {
      console.warn("Using local leaderboard fallback:", error);
      const localLeaderboard = JSON.parse(localStorage.getItem('academy_local_leaderboard') || '[]');
      setLeaderboardData(localLeaderboard);
    }
  };

  const getPlayerRank = () => {
    if (!playerName || leaderboardData.length === 0) return null;
    const rank = leaderboardData.findIndex(entry => entry.playerName === playerName) + 1;
    // Only return rank if it is between 1 and 100
    return (rank > 0 && rank <= 100) ? rank : null;
  };

  // Confetti effect
  useEffect(() => {
    if (showScore && activeQuestions.length > 0) {
      const percentage = (score / activeQuestions.length) * 100;
      if (percentage >= 80) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
      }
    }
  }, [showScore, score, activeQuestions.length]);

  const handleAnswerClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === activeQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after short delay
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < activeQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setIsAnswered(false);
        setSelectedOption(null);
      } else {
        handleQuizEnd();
      }
    }, 1000);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = async () => {
    if (!playerName.trim()) {
      alert("কুইজ শুরু করার আগে আপনার নাম দিন!");
      return;
    }
    localStorage.setItem('academy_player_name', playerName);
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/quiz?category=${selectedCategory}`);
      if (!res.ok) throw new Error('Failed to fetch quizzes');
      const data = await res.json();
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions returned from API');
      }
      
      const shuffled = shuffleArray(data.questions);
      setActiveQuestions(shuffled);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsStarted(true);
      setPlayerRank(null);
      setTimeLeft(categoriesInfo[selectedCategory].timeLimit);
    } catch (err) {
      console.warn("API/Database failed:", err);
      alert("কুইজ লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const restartQuiz = () => {
    startQuiz(); 
  };

  const backToCategories = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsStarted(false);
    setTimeLeft(0);
    setActiveQuestions([]);
    setSelectedCategory(null);
  };

  const toBengaliNumber = (num) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0, fontSize: '1.1rem' }}>কুইজ প্রতিযোগিতা</h2>
        </div>

        {(!isStarted && !showScore && getPlayerRank()) && (
          <div style={{ 
            background: getPlayerRank() === 1 
              ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' 
              : 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)', 
            boxShadow: getPlayerRank() === 1 
              ? '0 4px 12px rgba(245, 158, 11, 0.3)' 
              : '0 4px 12px rgba(99, 102, 241, 0.3)',
            padding: '0.4rem 0.8rem', 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Trophy size={16} color="white" />
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>
              {toBengaliNumber(getPlayerRank())}
            </span>
          </div>
        )}

        {(selectedCategory || showScore) && (
          <button 
            onClick={backToCategories}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> ক্যাটাগরি
          </button>
        )}
      </div>

      {!selectedCategory ? (
        // Category Selection Screen
        <div>
          <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
            কুইজ খেলার জন্য একটি বিষয় নির্বাচন করুন:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.values(categoriesInfo).map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-color)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{category.name}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      অফুরন্ত কুইজ
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : !isStarted ? (
        // Start Screen
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>
              {categoriesInfo[selectedCategory].name}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              কুইজে ২০টি প্রশ্ন আসবে এবং সম্পূর্ণ করার জন্য আপনার কাছে ৫ মিনিট ({toBengaliNumber(categoriesInfo[selectedCategory].timeLimit)} সেকেন্ড) সময় থাকবে।
            </p>
            
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>আপনার নাম (লিডারবোর্ডের জন্য):</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="যেমন: তুহিন" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <button 
            onClick={startQuiz}
            disabled={isLoading}
            className="btn"
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.6rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <RefreshCw size={18} className="spin" />
            ) : (
              <Play size={18} />
            )}
            {isLoading ? 'প্রশ্ন লোড হচ্ছে...' : 'শুরু করুন'}
          </button>
        </div>
      ) : showScore ? (
        // Score Screen
        <div style={{ textAlign: 'center', padding: '1rem', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Trophy size={48} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
            আপনার স্কোর: {toBengaliNumber(score)} / {toBengaliNumber(activeQuestions.length)}
          </h2>
          
          {getPlayerRank() && (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'inline-block' }}>
              <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                সবার মধ্যে আপনার অবস্থান: #{toBengaliNumber(getPlayerRank())}
              </span>
              <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>
                (মোট অংশগ্রহণকারী: {toBengaliNumber(leaderboardData.length)} জন)
              </span>
            </div>
          )}

          {(() => {
            const percentage = (score / activeQuestions.length) * 100;
            if (percentage === 100) return <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: '#4ade80', fontWeight: 'bold' }}>অসাধারণ পারফরম্যান্স! আপনি সবগুলো সঠিক উত্তর দিয়েছেন! 🏆</p>;
            if (percentage >= 80) return <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: '#4ade80', fontWeight: 'bold' }}>খুব ভালো করেছেন! চালিয়ে যান 🌟</p>;
            if (percentage >= 50) return <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: '#facc15', fontWeight: 'bold' }}>মোটামুটি ভালো! তবে আরও ভালো করার সুযোগ আছে 👍</p>;
            return <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: '#f87171', fontWeight: 'bold' }}>আপনাকে আরও শিখতে হবে! হতাশ হবেন না, আবার চেষ্টা করুন 📚</p>;
          })()}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button 
              onClick={restartQuiz}
              className="btn"
              style={{ background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
            >
              <RefreshCw size={18} /> নতুন কুইজ
            </button>
          </div>
        </div>
      ) : (
        // Question Screen
        <div>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              প্রশ্ন {toBengaliNumber(currentQuestion + 1)} / {toBengaliNumber(activeQuestions.length)}
            </span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: timeLeft <= 10 ? '#ef4444' : 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Timer size={14} /> {toBengaliNumber(timeLeft)}সে.
              </span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.85rem' }}>
                স্কোর: {toBengaliNumber(score)}
              </span>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.4 }}>
              {activeQuestions[currentQuestion]?.question}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeQuestions[currentQuestion]?.options?.map((option, index) => {
              let buttonStyle = {
                padding: '0.6rem 0.85rem',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: isAnswered ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              };

              if (isAnswered) {
                if (index === activeQuestions[currentQuestion]?.correctAnswer) {
                  buttonStyle.background = 'rgba(34, 197, 94, 0.2)';
                  buttonStyle.borderColor = '#22c55e';
                } else if (index === selectedOption) {
                  buttonStyle.background = 'rgba(239, 68, 68, 0.2)';
                  buttonStyle.borderColor = '#ef4444';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isAnswered}
                  style={buttonStyle}
                  onMouseOver={(e) => {
                    if (!isAnswered) {
                      e.currentTarget.style.background = 'var(--border-color)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isAnswered) {
                      e.currentTarget.style.background = 'var(--bg-color)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  {option}
                  {isAnswered && index === activeQuestions[currentQuestion]?.correctAnswer && (
                    <CheckCircle2 size={16} color="#22c55e" />
                  )}
                  {isAnswered && index === selectedOption && index !== activeQuestions[currentQuestion]?.correctAnswer && (
                    <XCircle size={16} color="#ef4444" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
