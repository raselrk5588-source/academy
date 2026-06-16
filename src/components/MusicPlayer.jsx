import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%' }}>
          <Music size={20} color="white" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>লো-ফাই মিউজিক</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>ফোকাস বাড়ানোর জন্য</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-icon" onClick={toggleMute} style={{ background: 'rgba(255,255,255,0.1)' }}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button className="btn btn-icon" onClick={togglePlay} style={{ background: 'var(--primary)' }}>
          {isPlaying ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
        </button>
      </div>

      {/* Royalty free lofi stream or file */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      />
    </div>
  );
}
