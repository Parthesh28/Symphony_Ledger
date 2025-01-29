import React, { useRef, useEffect } from 'react';
import { X, Volume2 } from 'lucide-react';
import { Song } from '../types/music';

interface AudioPlayerProps {
  song: Song;
  onClose: () => void;
}

export function AudioPlayer({ song, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [song]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900">{song.title}</h3>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Volume2 className="text-gray-500" size={20} />
          <audio ref={audioRef} src={song.previewUrl} controls className="w-48" />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}