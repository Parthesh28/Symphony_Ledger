export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  coverUrl: string;
  previewUrl: string;
  streams: {
    spotify: number;
    appleMusic: number;
    youtube: number;
  };
  releaseDate: string;
  walletAddress: string;
  verified?: boolean;
  hash?: string;
}

export type Genre = 'All' | 'Pop' | 'Rock' | 'Hip Hop' | 'Electronic' | 'Jazz' | 'Classical' | 'R&B';

export interface WalletInfo {
  address: string;
  balance: string;
  songs: number;
  totalStreams: number;
  earnings: string;
}