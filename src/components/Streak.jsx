import React, { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

export default function Streak() {
  const [quote, setQuote] = useState({ text: 'আজকের কাজ শুরু করুন!', author: 'একাডেমি' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyMotivation = async () => {
      try {
        const res = await fetch('/api/motivation');
        if (!res.ok) throw new Error('Failed to fetch motivation');
        const data = await res.json();
        if (data.quote) {
          setQuote(data.quote);
        } else {
          throw new Error('Quote not found');
        }
      } catch (err) {
        console.warn("Using default quote:", err);
        setQuote({ text: 'আপনার লক্ষ্য অর্জনে এগিয়ে যান!', author: 'একাডেমি' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyMotivation();
  }, []);

  return (
    <div className="glass-panel" style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      padding: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Sparkles size={24} color="var(--warning)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--warning)' }}>আজকের মোটিভেশন</h2>
      </div>

      <div style={{ position: 'relative', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)' }}>
        <Quote size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', opacity: 0.3 }} />
        {isLoading ? (
          <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-muted)' }}>লোড হচ্ছে...</p>
        ) : (
          <>
            <p style={{ margin: '0.5rem 0', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-main)', padding: '0 1rem', lineHeight: 1.5 }}>
              "{quote?.text || 'আপনার লক্ষ্য অর্জনে এগিয়ে যান!'}"
            </p>
            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              - {quote?.author || 'একাডেমি'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
