'use client';

import { useState, useRef, useEffect } from 'react';

import { Play, Pause } from 'lucide-react';

interface Props {
  src:   string;
  isMe:  boolean;
  time:  string;
}

export default function VoiceMessage({ src, isMe, time }: Props) {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress,  setProgress]    = useState(0);
  const [duration,  setDuration]    = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded  = () => setDuration(audio.duration);
    const onTime    = () => setProgress((audio.currentTime / audio.duration) * 100);
    const onEnded   = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('ended',          onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('ended',          onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { void audio.play(); setIsPlaying(true); }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const fmt = (s: number) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl shadow-sm min-w-[200px] ${
      isMe ? 'bg-emerald-600' : 'bg-white'
    }`}>
      <audio ref={audioRef} src={src} preload="metadata" />

     
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isMe ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-emerald-100 hover:bg-emerald-200'
        }`}
      >
        {isPlaying
          ? <Pause className={`w-4 h-4 ${isMe ? 'text-white' : 'text-emerald-600'}`} />
          : <Play  className={`w-4 h-4 ${isMe ? 'text-white' : 'text-emerald-600'}`} />
        }
      </button>

    
      <div className="flex-1 flex flex-col gap-1">
        <div
          className={`h-1.5 rounded-full cursor-pointer ${isMe ? 'bg-emerald-400' : 'bg-slate-200'}`}
          onClick={handleSeek}
        >
          <div
            className={`h-full rounded-full transition-all ${isMe ? 'bg-white' : 'bg-emerald-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className={`text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
            {fmt(audioRef.current?.currentTime ?? 0)}
          </span>
          <span className={`text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
            {fmt(duration)}
          </span>
        </div>
      </div>

     
      <span className={`text-[10px] flex-shrink-0 ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
        {time}
      </span>
    </div>
  );
}