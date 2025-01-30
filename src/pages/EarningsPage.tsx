import React from 'react';
import { DollarSign, TrendingUp, Calendar, Music2 } from 'lucide-react';

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Earnings Dashboard</h1>
            <p className="mt-2 text-gray-500">Track your music revenue and payouts</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Last updated:</span>
            <span className="text-sm font-medium text-purple-600">Just now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-purple-100">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">2.5 SOL</p>
                <p className="text-sm text-green-600 mt-1">+0.3 SOL this month</p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-purple-100">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Monthly Growth</p>
                <p className="text-3xl font-bold text-gray-900">15.3%</p>
                <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-purple-100">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Next Payout</p>
                <p className="text-3xl font-bold text-gray-900">0.5 SOL</p>
                <p className="text-sm text-blue-600 mt-1">In 3 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: 'Streaming Revenue',
                  source: 'Spotify',
                  amount: 0.05,
                  time: '2 days ago',
                  streams: 1250
                },
                {
                  title: 'Album Sales',
                  source: 'iTunes',
                  amount: 0.12,
                  time: '3 days ago',
                  streams: 45
                },
                {
                  title: 'Streaming Revenue',
                  source: 'Apple Music',
                  amount: 0.08,
                  time: '4 days ago',
                  streams: 890
                },
                {
                  title: 'Licensing Fee',
                  source: 'YouTube',
                  amount: 0.15,
                  time: '5 days ago',
                  streams: 2100
                },
                {
                  title: 'Streaming Revenue',
                  source: 'Amazon Music',
                  amount: 0.04,
                  time: '6 days ago',
                  streams: 670
                }
              ].map((transaction, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-purple-50/50 rounded-lg transition-colors duration-300 px-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Music2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">{transaction.source}</p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-500">{transaction.streams} streams</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{transaction.amount} SOL</p>
                    <p className="text-sm text-gray-500 mt-1">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}