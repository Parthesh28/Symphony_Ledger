import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types/music';

interface SongCardProps {
  song: Song;
  onShowInfo: (song: Song) => void;
}

export function SongCard({ song, onShowInfo }: SongCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group px-6 py-4 bg-white rounded-lg hover:bg-purple-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-100"
      onClick={() => onShowInfo(song)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4">
            <h3 className="font-medium text-lg text-gray-900 truncate group-hover:text-purple-700 transition-colors">
              {song.title}
            </h3>
            <span className="text-sm text-gray-400 flex-shrink-0">
              {song.duration}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">{song.artist}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 truncate">{song.album}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="w-0 h-full bg-purple-500 group-hover:w-full transition-all duration-700 ease-out" />
      </div>
    </motion.div>
  );
}