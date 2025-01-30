import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Music, Wallet, Loader2, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSymphonyProgram } from "../smart";
import { SongCard } from '../components/SongCard';
import { SongInfoModal } from '../components/SongInfoModal';
import { Song } from "../types/music";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function MySongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);

  const wallet = useAnchorWallet();
  const { fetchAllRecordings } = useSymphonyProgram();

  useEffect(() => {
    const loadSongs = async () => {
      if (!wallet) {
        setLoading(false);
        return;
      }

      try {
        const fetchedSongs = await fetchAllRecordings();
        if (fetchedSongs.success === false) {
          console.error("Error:", fetchedSongs.error);
          setError("Failed to fetch recordings");
          return;
        }

        // Transform and filter songs where wallet public key matches
        const userSongs = fetchedSongs
          .map(song => ({
            ...song.account,
            id: song.publicKey.toBase58(),
            title: song.account.title,
            artist: song.account.artistName,
            genre: song.account.genre,
            cover: song.account.coverUrl,
            audio: song.account.audioUrl,
          }))
          .filter(song =>
            song.artist?.pubkey?.toBase58() === wallet.publicKey.toBase58() ||
            song.composer?.pubkey?.toBase58() === wallet.publicKey.toBase58() ||
            song.producer?.pubkey?.toBase58() === wallet.publicKey.toBase58() ||
            song.label?.pubkey?.toBase58() === wallet.publicKey.toBase58()
          );

        setSongs(userSongs);
      } catch (error) {
        console.error("Error loading songs:", error);
        setError("An error occurred while fetching recordings");
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [wallet]);

  const handlePlay = (song: Song) => {
    setPlayingSong(song);
  };

  const handleShowInfo = (song: Song) => {
    setSelectedSong(song);
    setShowInfoModal(true);
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Wallet className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600">
            Please connect your wallet to view your songs
          </p>
        </div>
      </div>
    );
  }

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
            My Songs
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage your music collection on the blockchain
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Songs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {songs.length > 0 ? (
                songs.map((song) => (
                  <motion.div key={song.id} variants={itemVariants} layout>
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
                  <p className="text-gray-500">
                    No songs found associated with your wallet
                  </p>
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
              {/* <AudioPlayer
                song={playingSong}
                onClose={() => setPlayingSong(null)}
              /> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}