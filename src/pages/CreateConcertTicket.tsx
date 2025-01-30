import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Music, Ticket, DollarSign, Users, ArrowRight } from 'lucide-react';
import { useSymphonyProgram } from '../smart';

const CustomInput = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {Icon && <Icon className="w-4 h-4 inline mr-2" />}
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
    />
  </div>
);

const CustomButton = ({ variant = 'filled', children, className = '', ...props }) => {
  const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50";
  const variants = {
    filled: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
  };
  
  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const CustomAlert = ({ type, children }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]}`}>
      {children}
    </div>
  );
};

const CreateConcertTicket = () => {
  const [formData, setFormData] = useState({
    recordingId: '',
    artist: '',
    date: '',
    time: '',
    venue: '',
    ticketPrice: '',
    totalTickets: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {createTicketSale} = useSymphonyProgram();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const eventTimestamp = new Date(`${formData.date} ${formData.time}`).getTime();
      const priceInSol = parseFloat(formData.ticketPrice);
      
      const result = await createTicketSale(
        formData.recordingId,
        priceInSol,
        parseInt(formData.totalTickets),
        eventTimestamp,
        formData.venue
      );

      if (result.success) {
        setStatus({
          type: 'success',
          message: `Event created successfully! Transaction: ${result.signature.slice(0, 8)}...`
        });
        setFormData({
          recordingId: '',
          artist: '',
          date: '',
          time: '',
          venue: '',
          ticketPrice: '',
          totalTickets: ''
        });
      } else {
        setStatus({
          type: 'error',
          message: 'Failed to create event. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Error: ${error.message || 'Something went wrong'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
              Music Explorer
            </h1>
          </div>
          <div className="flex gap-4">
            <CustomButton variant="outline">Explore</CustomButton>
            <CustomButton variant="outline">My Events</CustomButton>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b bg-gradient-to-r from-purple-50 to-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Ticket className="w-6 h-6 text-purple-600" />
              Create New Event
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Main Info Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <CustomInput
                    label="Recording ID"
                    name="recordingId"
                    value={formData.recordingId}
                    onChange={handleChange}
                    placeholder="Enter recording ID"
                    required
                  />

                  <CustomInput
                    label="Artist Name"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    placeholder="Featured artist or band"
                    required
                  />

                  <CustomInput
                    label="Venue"
                    icon={MapPin}
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Event location"
                    required
                  />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                      label="Date"
                      icon={Calendar}
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                    <CustomInput
                      label="Time"
                      icon={Clock}
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                      label="Ticket Price (SOL)"
                      icon={DollarSign}
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      placeholder="2.5"
                      step="0.1"
                      min="0"
                      required
                    />
                    <CustomInput
                      label="Total Tickets"
                      icon={Users}
                      type="number"
                      name="totalTickets"
                      value={formData.totalTickets}
                      onChange={handleChange}
                      placeholder="1000"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {status.message && (
                <CustomAlert type={status.type}>
                  {status.message}
                </CustomAlert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <CustomButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setFormData({
                    recordingId: '',
                    artist: '',
                    date: '',
                    time: '',
                    venue: '',
                    ticketPrice: '',
                    totalTickets: ''
                  })}
                >
                  Clear Form
                </CustomButton>
                <CustomButton
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">◌</span>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Event
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </CustomButton>
              </div>

              {/* Footer Information */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  Instant blockchain confirmation
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  Digital tickets minted to wallet
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  Secure smart contract deployment
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateConcertTicket;