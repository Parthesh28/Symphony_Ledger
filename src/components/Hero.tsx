import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Music2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                Protect Your Music
              </span>
              <span className="block mt-2">
                with Blockchain
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-xl"
            >
              Secure your music rights and maximize earnings with our advanced blockchain verification system. Simple, secure, and built for creators.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/verify"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-200 hover:shadow-xl"
              >
                <Music2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Verify Your Music
              </Link>
              <Link
                to="/explore"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium text-purple-600 bg-white rounded-lg shadow-lg hover:bg-purple-50 transition-all duration-200 hover:shadow-xl"
              >
                <Shield className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Explore Music
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8"
            >
              {[
                { icon: Shield, text: "Secure Rights" },
                { icon: Music2, text: "Prevent Piracy" },
                { icon: DollarSign, text: "Earn More" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-600">
                  <feature.icon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Abstract Shape */}
          <motion.div
            variants={fadeIn}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Hero;