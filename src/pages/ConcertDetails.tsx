import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Heart, Ticket, Plus, Minus } from 'lucide-react';
import { useSymphonyProgram } from '../smart';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface Concert {
  publicKey: PublicKey;
  account: {
    authority: PublicKey;
    title: string;
    artist: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    price: number;
    description: string;
    available: number;
    sold: number;
  };
}

function ConcertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { purchaseTicket, fetchAllShows } = useSymphonyProgram();
  const { publicKey } = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [concert, setConcert] = useState<Concert | null>(null);

  useEffect(() => {
    const loadConcertData = async () => {
      try {
        const shows = await fetchAllShows();
        if (shows.success === false) {
          throw new Error('Failed to fetch shows');
        }
        
        const selectedConcert = shows.find(
          show => show.publicKey.toString() === id
        );
        
        if (selectedConcert) {
          setConcert(selectedConcert);
        }
      } catch (err) {
        setError('Failed to load concert details');
        console.error('Error loading concert:', err);
      }
    };

    loadConcertData();
  }, [id, fetchAllShows]);

  if (!concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading concert details...</p>
      </div>
    );
  }

  const formattedDate = new Date(concert.account.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    if (action === 'increment' && quantity < concert.account.available) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBuy = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await purchaseTicket(
        quantity,
        concert.account.authority
      );
      
      if (response?.success) {
        navigate('/tickets');
      } else {
        throw new Error(response?.error?.message || 'Failed to purchase tickets');
      }
    } catch (err) {
      setError(err.message || 'Failed to purchase tickets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Image */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/400/320"
            alt={concert.account.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{concert.account.title}</h1>
              <p className="text-2xl text-primary font-medium mb-6">{concert.account.artist}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span>{concert.account.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-primary" />
                  <span>{concert.account.venue}, {concert.account.city}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About the Event</h2>
                <p className="text-gray-600 leading-relaxed">{concert.account.description}</p>
              </div>
            </div>

            {/* Ticket Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Price</h3>
                  <p className="text-3xl font-bold text-primary">{concert.account.price} SOL</p>
                </div>

                {/* Quantity Counter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                      disabled={quantity >= concert.account.available}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {concert.account.available} tickets available
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-900">
                    Total: {(concert.account.price * quantity).toFixed(2)} SOL
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleBuy}
                    disabled={isLoading || concert.account.available < quantity}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark bg-purple-500 text-white px-6 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Ticket className="w-5 h-5" />
                    {isLoading ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
                  </button>

                  <div className="text-sm text-gray-500">
                    <p className="mb-2">• Instant confirmation</p>
                    <p className="mb-2">• Digital tickets sent to your wallet</p>
                    <p>• Secure blockchain transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConcertDetails;