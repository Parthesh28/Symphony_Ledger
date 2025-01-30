import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Search, Music, Heart } from 'lucide-react';

// Types
interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  image: string;
  description: string;
}

// Data
const concerts: Concert[] = [
  {
    id: '1',
    title: 'Summer Vibes Festival',
    artist: 'Taylor Swift',
    date: '2024-07-15',
    time: '19:00',
    venue: 'Central Park Arena',
    city: 'New York, NY',
    price: 2.5,
    image: '/api/placeholder/400/320',
    description: 'Experience an unforgettable evening with Taylor Swift as she performs her greatest hits under the summer stars.'
  },
  {
    id: '2',
    title: 'Rock Revolution',
    artist: 'Foo Fighters',
    date: '2024-08-22',
    time: '20:00',
    venue: 'Stadium X',
    city: 'Los Angeles, CA',
    price: 1.8,
    image: '/api/placeholder/400/320',
    description: 'Get ready for an explosive night of rock music with the legendary Foo Fighters.'
  },
  {
    id: '3',
    title: 'Jazz Night',
    artist: 'Diana Krall',
    date: '2024-09-10',
    time: '21:00',
    venue: 'Blue Note Jazz Club',
    city: 'Chicago, IL',
    price: 3.2,
    image: '/api/placeholder/400/320',
    description: 'An intimate evening of jazz classics and original compositions by the incomparable Diana Krall.'
  }
];

function ConcertCard({ concert }: { concert: Concert }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = new Date(concert.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/concert/${concert.id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="h-64 overflow-hidden">
        <img
          src={concert.image}
          alt={concert.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div className="transform transition-transform duration-300 translate-y-8 group-hover:translate-y-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold mb-1">{concert.title}</h3>
              <p className="text-lg font-medium text-white/90">{concert.artist}</p>
            </div>
            <button
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
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
              <span className="text-sm">{concert.time}</span>
            </div>
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{concert.venue}, {concert.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-2xl font-bold">{concert.price} SOL</span>
            <button
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/concert/${concert.id}`);
              }}
            >
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExploreShows() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredConcerts = concerts.filter(concert =>
    concert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concert.city.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-4xl font-bold">
                Live Shows
              </h1>
              <p className="text-gray-600 mt-1">Discover upcoming concerts near you</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConcerts.map(concert => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { concerts };