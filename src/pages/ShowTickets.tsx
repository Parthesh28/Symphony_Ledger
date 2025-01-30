import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Music } from 'lucide-react';
import { concerts } from './ExploreShows';

interface Ticket {
  id: string;
  concertId: string;
  recipientName: string;
  purchaseDate: string;
  quantity: number;
  concert: typeof concerts[0];
}

const tickets: Ticket[] = [
  {
    id: '1',
    concertId: '1',
    recipientName: 'John Doe',
    purchaseDate: '2024-03-15',
    quantity: 2,
    concert: concerts[0]
  },
  {
    id: '2',
    concertId: '2',
    recipientName: 'Jane Smith',
    purchaseDate: '2024-03-14',
    quantity: 1,
    concert: concerts[1]
  }
];

function TicketCard({ ticket }: { ticket: Ticket }) {
  const formattedDate = new Date(ticket.concert.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{ticket.concert.title}</h3>
            <p className="text-lg text-primary">by {ticket.concert.artist}</p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {ticket.quantity} {ticket.quantity === 1 ? 'Ticket' : 'Tickets'}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            <span>{ticket.concert.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <span>{ticket.concert.venue}, {ticket.concert.city}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Ticket className="w-5 h-5 mr-2 text-primary" />
            <span>Recipient: {ticket.recipientName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShowTickets() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Ticket className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">My Tickets</h1>
          </div>
          <button
            onClick={() => navigate('/shows')}
            className="text-primary hover:text-primary-dark flex items-center gap-2"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No tickets found</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't purchased any tickets yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Explore Shows
            </button>
          </div>
        )}
      </div>
    </div>
  );
}