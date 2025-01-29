import React from 'react';
import { songs } from '../data/songs';
import { SongCard } from '../components/SongCard';

export default function MySongsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Songs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={() => {}}
            onShowInfo={() => {}}
          />
        ))}
      </div>
    </div>
  );
}