import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Search, Heart, Calendar, Clock, MapPin } from 'lucide-react';
import { useSymphonyProgram } from '../smart.ts';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BN } from "@coral-xyz/anchor";

interface Show {
  publicKey: PublicKey;
  account: {
    recordingId: string;
    ticketPrice: BN;
    totalTickets: number;
    soldTickets: number;
    eventDate: BN;
    venue: string;
    authority: PublicKey;
  };
}

function ShowCard({ show }: { show: Show }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { purchaseTicket } = useSymphonyProgram();
  
  const formattedDate = new Date(show.account.eventDate.toNumber()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(show.account.eventDate.toNumber()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const priceInSol = show.account.ticketPrice.toNumber() / 1000000000;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    
    setIsLoading(true);
    try {
      const result = await purchaseTicket(
        1, // quantity - purchasing 1 ticket
        show.account.authority // authority from the show
      );
      
      if (result.success) {
        console.log('Ticket purchased successfully:', result.signature);
        // You could add a success notification here
      } else {
        console.error('Failed to purchase ticket:', result.error);
        // You could add an error notification here
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      // You could add an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/show/${show.publicKey.toString()}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="h-64 overflow-hidden">
        <img
          src="/api/placeholder/400/320"
          alt={`Show ${show.account.recordingId}`}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div className="transform transition-transform duration-300 translate-y-8 group-hover:translate-y-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold mb-1">Show #{show.account.recordingId}</h3>
            </div>
            <button
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center text-white/80">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center text-white/80">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{show.account.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="space-y-1">
              <span className="text-2xl font-bold">{priceInSol * LAMPORTS_PER_SOL} SOL</span>
              <div className="text-sm text-white/80">
                {show.account.soldTickets} / {show.account.totalTickets} tickets sold
              </div>
            </div>
            <button
              className={`px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Purchasing...' : 'Get Tickets'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExploreShows() {
  // Rest of the ExploreShows component remains the same
  const [searchTerm, setSearchTerm] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchAllShows } = useSymphonyProgram();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const showsData = await fetchAllShows();
        if (Array.isArray(showsData)) {
          setShows(showsData);
        }
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [fetchAllShows]);

  const filteredShows = shows.filter(show =>
    show.account.recordingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.account.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Live Shows</h1>
              <p className="text-gray-600 mt-1">Discover upcoming shows on Symphony</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shows..."
                className="w-72 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading shows...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShows.map(show => (
              <ShowCard key={show.publicKey.toString()} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}