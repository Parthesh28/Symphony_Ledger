import React from 'react';
import { X, Music2, Calendar, PlayCircle, Wallet } from 'lucide-react';
import { Song } from '../types/music';

interface SongInfoModalProps {
  song: Song;
  onClose: () => void;
}

export function SongInfoModal({ song, onClose }: SongInfoModalProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(song.walletAddress);
      alert('Wallet address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy wallet address:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <X className="text-white" size={20} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{song.title}</h2>
          <p className="text-xl text-gray-600 mb-6">{song.artist}</p>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Music2 className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Album</p>
                  <p className="font-medium">{song.album}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Release Date</p>
                  <p className="font-medium">
                    {new Date(song.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PlayCircle className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{song.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="text-purple-600" size={20} />
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Artist Wallet</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono text-sm truncate">
                      {song.walletAddress}
                    </p>
                    <button
                      onClick={copyWalletAddress}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Streaming Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spotify</span>
                  <span className="font-medium">{formatNumber(song.streams.spotify)} plays</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Apple Music</span>
                  <span className="font-medium">{formatNumber(song.streams.appleMusic)} plays</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">YouTube</span>
                  <span className="font-medium">{formatNumber(song.streams.youtube)} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}