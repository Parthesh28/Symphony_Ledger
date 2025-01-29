import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shield, CheckCircle, XCircle, FileMusic, AlertCircle, Loader2, Hash } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AudioFingerprinter } from '../types/audioFingerprint';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fingerprinterRef = useRef<AudioFingerprinter | null>(null);

  useEffect(() => {
    fingerprinterRef.current = new AudioFingerprinter();

    return () => {
      fingerprinterRef.current?.dispose();
    };
  }, []);

  const generateFingerprint = async (file: File) => {
    try {
      setProgress(0);
      setVerificationStatus('processing');
      setError(null);

      // Start fingerprint generation
      setProgress(20);
      const fingerprint = await fingerprinterRef.current?.generateFingerprint(file);
      setProgress(40);

      if (fingerprint) {
        setFingerprint(fingerprint);
        // Simulate blockchain verification
        await simulateBlockchainCheck();
        setProgress(100);
        setVerificationStatus('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing audio file');
      setVerificationStatus('error');
    }
  };

  const simulateBlockchainCheck = async () => {
    return new Promise<void>(resolve => {
      let currentProgress = 40;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 90) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      await generateFingerprint(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const steps = [
    {
      icon: FileMusic,
      label: 'Analyzing audio file',
      status: progress >= 20 ? 'complete' : progress > 0 ? 'processing' : 'pending'
    },
    {
      icon: Hash,
      label: 'Generating audio fingerprint',
      status: progress >= 40 ? 'complete' : progress > 20 ? 'processing' : 'pending'
    },
    {
      icon: Shield,
      label: 'Verifying on blockchain',
      status: progress >= 90 ? 'complete' : progress > 40 ? 'processing' : 'pending'
    },
    {
      icon: CheckCircle,
      label: 'Creating verification certificate',
      status: progress >= 100 ? 'complete' : progress > 90 ? 'processing' : 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header section remains the same */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400"
          >
            Verify Your Music
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 text-lg"
          >
            Protect your creations with blockchain technology
          </motion.p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
        >
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${isDragActive
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
              }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Upload className="mx-auto h-16 w-16 text-purple-400" />
              </motion.div>
              <div className="mt-6 space-y-2">
                <p className="text-lg text-gray-600">
                  {isDragActive ? (
                    "Drop your audio file here..."
                  ) : (
                    <>
                      <span className="text-purple-600 font-medium">Click to upload</span>
                      {" or drag and drop"}
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  MP3, WAV up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6">Verification Progress</h3>

                {/* Steps */}
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative">
                        {step.status === 'processing' ? (
                          <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <step.icon
                              className={`h-6 w-6 ${step.status === 'complete'
                                  ? 'text-green-500'
                                  : 'text-gray-300'
                                }`}
                            />
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-sm ${step.status === 'processing'
                          ? 'text-purple-600'
                          : step.status === 'complete'
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    />
                  </div>
                </div>

                {/* Fingerprint Display */}
                {fingerprint && verificationStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-purple-50 rounded-lg"
                  >
                    <p className="text-sm font-medium text-purple-800">Audio Fingerprint:</p>
                    <p className="mt-2 font-mono text-xs text-purple-600 break-all">
                      {fingerprint}
                    </p>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-red-50 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error processing file</p>
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}