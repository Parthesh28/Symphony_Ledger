import React from 'react';
import { Shield, Music2, DollarSign, Lock } from 'lucide-react';

export function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Protect Your Musical Legacy
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform uses advanced blockchain technology to ensure your music remains protected and authentic.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Piracy Protection</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Verify the authenticity of your music and protect it from unauthorized distribution.
              </p>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <Lock className="h-6 w-6" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Blockchain Security</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Your music is secured using immutable blockchain technology.
              </p>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <Music2 className="h-6 w-6" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Easy Verification</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Simple upload process to verify and protect your original music.
              </p>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Earnings</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Track and secure your streaming revenue through blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}