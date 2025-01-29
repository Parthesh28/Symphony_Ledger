import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shield, CheckCircle, XCircle, FileMusic, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      simulateVerification();
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

  const simulateVerification = () => {
    setVerificationStatus('processing');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setVerificationStatus('success');
      }
    }, 200);
  };

  const steps = [
    { icon: Shield, label: 'Analyzing audio fingerprint', status: progress >= 33 ? 'complete' : progress > 0 ? 'processing' : 'pending' },
    { icon: CheckCircle, label: 'Checking blockchain records', status: progress >= 66 ? 'complete' : progress > 33 ? 'processing' : 'pending' },
    { icon: FileMusic, label: 'Generating verification certificate', status: progress >= 100 ? 'complete' : progress > 66 ? 'processing' : 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg
                ${verificationStatus === 'success'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-colors duration-300`}
              onClick={() => !file && document.getElementById('file-upload')?.click()}
              disabled={verificationStatus === 'processing'}
            >
              {verificationStatus === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : verificationStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verified Successfully
                </>
              ) : (
                'Start Verification'
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}