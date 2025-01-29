import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ChevronDown, User, Music2, DollarSign, LogOut } from 'lucide-react';
import { WalletInfo } from '../types/music';

export function WalletButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletInfo] = useState<WalletInfo>({
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '1.245 ETH',
    songs: 12,
    totalStreams: 1500000,
    earnings: '2.5 ETH'
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors z-10"
      >
        <Wallet size={20} />
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Connected Wallet</p>
                <p className="text-xs text-gray-500 font-mono">{walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Balance</span>
                <span className="text-sm font-medium">{walletInfo.balance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Songs</span>
                <span className="text-sm font-medium">{walletInfo.songs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Streams</span>
                <span className="text-sm font-medium">{walletInfo.totalStreams.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Earnings</span>
                <span className="text-sm font-medium">{walletInfo.earnings}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1">
              <Link
                to="/my-songs"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Music2 size={16} />
                My Songs
              </Link>
              <Link
                to="/earnings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <DollarSign size={16} />
                Earnings
              </Link>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}