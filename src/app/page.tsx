import { Music } from 'lucide-react';
import { WalletButton } from '../components/WalletButton';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Music Explorer</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </a>
              <a href="/verify" className="text-gray-600 hover:text-gray-900">
                Verify Music
              </a>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}