import React from 'react';
import { Play, Info } from 'lucide-react';
import { Song } from '../types/music';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onShowInfo: (song: Song) => void;
}

export function SongCard({ song, onPlay, onShowInfo }: SongCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={song.coverUrl} 
        alt={`${song.title} cover`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{song.title}</h3>
        <p className="text-gray-600 truncate">{song.artist}</p>
        <p className="text-gray-500 text-sm">{song.album}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{song.duration}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onPlay(song)}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors"
            >
              <Play size={18} />
            </button>
            <button
              onClick={() => onShowInfo(song)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <Info size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}