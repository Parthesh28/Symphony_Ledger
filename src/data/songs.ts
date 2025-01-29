import { Song } from '../types/music';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Stellar Journey',
    duration: '3:45',
    genre: 'Electronic',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    streams: {
      spotify: 15000000,
      appleMusic: 8000000,
      youtube: 25000000
    },
    releaseDate: '2024-01-15',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  {
    id: '2',
    title: 'Urban Rhythm',
    artist: 'The Beat Makers',
    album: 'City Lights',
    duration: '4:20',
    genre: 'Hip Hop',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    streams: {
      spotify: 22000000,
      appleMusic: 12000000,
      youtube: 35000000
    },
    releaseDate: '2024-02-01',
    walletAddress: '0x3845Cc6634C0532925a3b844Bc454e4438f785c'
  }
];