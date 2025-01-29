import React, { useState, useEffect } from 'react';
import { Search, Music2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { songs } from '../data/songs';
import { Song, Genre } from '../types/music';
import { SongCard } from './SongCard';
import { SongInfoModal } from './SongInfoModal';
import { AudioPlayer } from './AudioPlayer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export function ExploreSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const genres: Genre[] = ['All', 'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'R&B'];

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handlePlay = (song: Song) => {
    setPlayingSong(song);
  };

  const handleShowInfo = (song: Song) => {
    setSelectedSong(song);
    setShowInfoModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 mb-4">
            Explore Music
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and verify amazing music from talented artists around the world
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl 
                          focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-lg shadow-purple-100/20
                          placeholder:text-gray-400 transition-all duration-300"
              />
            </div>

            {/* Genre Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {genres.map((genre) => (
                <motion.button
                  key={genre}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${selectedGenre === genre
                      ? 'bg-purple-600 text-white shadow-purple-200'
                      : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-purple-50'
                    }`}
                >
                  {genre}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Songs Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <motion.div
                    key={song.id}
                    variants={itemVariants}
                    layout
                  >
                    <SongCard
                      song={song}
                      onPlay={handlePlay}
                      onShowInfo={handleShowInfo}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <Music2 className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500">No songs found matching your criteria</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Info Modal */}
        <AnimatePresence>
          {showInfoModal && selectedSong && (
            <SongInfoModal
              song={selectedSong}
              onClose={() => {
                setShowInfoModal(false);
                setSelectedSong(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Audio Player */}
        <AnimatePresence>
          {playingSong && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0"
            >
              <AudioPlayer
                song={playingSong}
                onClose={() => setPlayingSong(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}