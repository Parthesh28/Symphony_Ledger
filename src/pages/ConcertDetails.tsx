import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Music, Ticket } from 'lucide-react';
import { concerts } from './ExploreShows';

export function ConcertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const concert = concerts.find(c => c.id === id);

  if (!concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Concert not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary-dark"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(concert.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const totalPrice = concert.price * ticketQuantity;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-primary hover:text-primary-dark flex items-center gap-2"
        >
          ← Back to Explore
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-96 relative">
            <img 
              src={concert.image} 
              alt={concert.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-2">{concert.title}</h1>
                <p className="text-2xl text-primary-light">{concert.artist}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-6 h-6 mr-3 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-6 h-6 mr-3 text-primary" />
                    <span>{concert.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-6 h-6 mr-3 text-primary" />
                    <span>{concert.venue}, {concert.city}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Music className="w-6 h-6 mr-3 text-primary" />
                    <span>{concert.artist}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary">About the Event</h3>
                  <p className="text-gray-700 leading-relaxed">{concert.description}</p>
                </div>
              </div>

              <div>
                <div className="bg-white p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-xl font-bold mb-4 text-primary">Purchase Tickets</h3>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-2">Price per ticket</p>
                    <p className="text-3xl font-bold text-primary">{concert.price} SOL</p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Number of tickets</label>
                    <select 
                      className="w-full p-2 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-700">Total price</p>
                    <p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} SOL</p>
                  </div>
                  <button className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary-dark transition-colors">
                    <Ticket className="w-5 h-5" />
                    <span>Buy Tickets</span>
                  </button>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Secure checkout powered by Solana Pay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}