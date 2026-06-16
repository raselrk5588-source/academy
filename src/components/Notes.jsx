import React, { useState, useEffect, useRef } from 'react';
import { StickyNote, Save } from 'lucide-react';

export default function Notes() {
  const [noteText, setNoteText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('academy_notes_v2') || '';
    }
    return '';
  });
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('academy_notes_v2', noteText);
      setIsSaved(true);
    }, 1000); // Auto-save after 1 second of typing

    return () => clearTimeout(timer);
  }, [noteText]);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight when deleting text
      textareaRef.current.style.height = 'auto';
      // Set the height to match scrollHeight but minimum 100px
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [noteText]);

  const handleChange = (e) => {
    setNoteText(e.target.value);
    setIsSaved(false);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StickyNote size={20} color="var(--primary)" />
          <h2 className="heading-2" style={{ margin: 0 }}>দ্রুত নোট</h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: isSaved ? 'var(--success)' : 'var(--text-muted)' }}>
          {isSaved ? 'সংরক্ষিত' : 'সংরক্ষণ করা হচ্ছে...'}
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={noteText}
        onChange={handleChange}
        placeholder="এখানে আপনার দ্রুত চিন্তা লিখে রাখুন..."
        style={{
          width: '100%',
          minHeight: '100px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          color: 'white',
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
          transition: 'border-color 0.3s ease',
          overflow: 'hidden'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />
    </div>
  );
}
