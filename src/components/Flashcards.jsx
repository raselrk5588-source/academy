import React, { useState, useEffect } from 'react';
import { Layers, Plus, ChevronRight, ChevronLeft, Trash2, RefreshCw } from 'lucide-react';

export default function Flashcards() {
  const [dbCards, setDbCards] = useState([]);
  const [userCards, setUserCards] = useState(() => {
    const saved = localStorage.getItem('academy_flashcards_user');
    if (saved) return JSON.parse(saved);
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  // Combined cards: Database cards + User added cards
  const cards = [...dbCards, ...userCards];

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/flashcards');
      if (!res.ok) throw new Error('Failed to fetch flashcards');
      const data = await res.json();
      if (!data.flashcards || data.flashcards.length === 0) {
        throw new Error('No flashcards found in database');
      }
      setDbCards(data.flashcards);
    } catch (err) {
      console.warn("API/Database failed:", err);
      setDbCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('academy_flashcards_user', JSON.stringify(userCards));
  }, [userCards]);

  const addCard = (e) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    const newCard = { id: Date.now(), q: newQ, a: newA, isUser: true };
    setUserCards([...userCards, newCard]);
    setNewQ('');
    setNewA('');
    setShowAdd(false);
    setCurrentIndex(cards.length); // Point to the newly added card (end of combined array)
    setIsFlipped(false);
  };

  const deleteCurrent = () => {
    const currentCard = cards[currentIndex];
    
    // Only allow deleting user-created cards, or just delete it from view for this session
    if (currentCard.isUser) {
      const newUserCards = userCards.filter(c => c.id !== currentCard.id);
      setUserCards(newUserCards);
    } else {
      // If they want to delete a DB card, we can just remove it from the session array
      const newDbCards = dbCards.filter(c => c.id !== currentCard.id);
      setDbCards(newDbCards);
    }

    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0 }}>ফ্ল্যাশকার্ডস</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-icon" onClick={fetchFlashcards} title="নতুন কার্ড লোড করুন">
            <RefreshCw size={18} className={isLoading ? "spin" : ""} />
          </button>
          <button className="btn btn-icon" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={addCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <input type="text" className="input-field" placeholder="প্রশ্ন..." value={newQ} onChange={e => setNewQ(e.target.value)} />
          <input type="text" className="input-field" placeholder="উত্তর..." value={newA} onChange={e => setNewA(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn" style={{ flex: 1, background: 'var(--success)' }}>যোগ করুন</button>
            <button type="button" className="btn" onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>বাতিল</button>
          </div>
        </form>
      )}

      {isLoading && dbCards.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={32} color="var(--primary)" className="spin" />
          <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>কার্ড লোড হচ্ছে...</span>
        </div>
      ) : cards.length > 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              flex: 1,
              background: isFlipped ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'pointer',
              minHeight: '150px',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: isFlipped ? 500 : 600 }}>
              {isFlipped ? cards[currentIndex].a : cards[currentIndex].q}
            </h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn btn-icon" onClick={prevCard} disabled={currentIndex === 0} style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}>
              <ChevronLeft size={20} />
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-icon" onClick={nextCard} disabled={currentIndex === cards.length - 1} style={{ opacity: currentIndex === cards.length - 1 ? 0.5 : 1 }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>কোনো ফ্ল্যাশকার্ড নেই।</p>
      )}
    </div>
  );
}
