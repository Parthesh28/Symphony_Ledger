import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Heart, Ticket } from 'lucide-react';

function ConcertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Find the concert from the concerts array
  const concert = concerts.find(c => c.id === id);

  if (!concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Concert not found</p>
      </div>
    );
  }

  const formattedDate = new Date(concert.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Image */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img
            src={concert.image}
            alt={concert.title}
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{concert.title}</h1>
              <p className="text-2xl text-primary font-medium mb-6">{concert.artist}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span>{concert.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-primary" />
                  <span>{concert.venue}, {concert.city}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About the Event</h2>
                <p className="text-gray-600 leading-relaxed">{concert.description}</p>
              </div>
            </div>

            {/* Ticket Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Price</h3>
                  <p className="text-3xl font-bold text-primary">{concert.price} SOL</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // Add ticket purchase logic here
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors"
                  >
                    <Ticket className="w-5 h-5" />
                    Buy Tickets
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