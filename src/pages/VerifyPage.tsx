import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Shield, CheckCircle, Music, Users,
  Loader2, Hash, AlertCircle, AlertTriangle, FileMusic
} from 'lucide-react';
import { useSymphonyProgram } from '../smart';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { AudioFingerprinter } from '../types/audioFingerprint';
import { analyzeAudioContent } from '../../gemini';

const UnifiedSongRegistration = () => {
  const wallet = useAnchorWallet();
  const { connected, connect } = useWallet();

  // File and verification states
  const [file, setFile] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadState, setUploadState] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState(null);

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('upload');

  // Hooks
  const { fetchAllRecordings, addRecording } = useSymphonyProgram();
  const fingerprinterRef = useRef(null);

  const [formData, setFormData] = useState({
    length: 0,
    release_year: new Date().getFullYear(),
    artist_name: '',
    artist_share: 40,
    composer_name: '',
    composer_pubkey: '',
    composer_share: 20,
    producer_name: '',
    producer_pubkey: '',
    producer_share: 20,
    label_name: '',
    label_pubkey: '',
    label_share: 20,
    album: '',
    id: crypto.randomUUID(),
    title: ''
  });

  useEffect(() => {
    fingerprinterRef.current = new AudioFingerprinter();
    return () => fingerprinterRef.current?.dispose();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (['length', 'release_year'].includes(name)) {
      processedValue = parseInt(value, 10) || 0;
    } else if (name.endsWith('_share')) {
      processedValue = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const generateFingerprint = async (file) => {
    try {
      setVerificationProgress(0);
      setVerificationStatus('processing');
      setError(null);
      setContentAnalysis(null);

      // Start fingerprint generation
      setVerificationProgress(15);
      const fingerprint = await fingerprinterRef.current?.generateFingerprint(file);
      setVerificationProgress(30);

      if (fingerprint) {
        setFingerprint(fingerprint);

        // Analyze content
        setVerificationProgress(40);
        const analysis = await analyzeAudioContent(fingerprint);
        setContentAnalysis(analysis);
        setVerificationProgress(60);

        // Check for duplicates
        const isMatch = await compareFP(fingerprint);
        setVerificationProgress(80);

        if (!isMatch) {
          setVerificationProgress(100);
          setVerificationStatus('success');
          setActiveSection('form');
        } else {
          setVerificationStatus('error');
          setError('Duplicate item found. Verification unsuccessful.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing audio file');
      setVerificationStatus('error');
    }
  };

  const compareFP = async (fingerprint) => {
    const response = await fetchAllRecordings();
    console.log(response);

    if (fingerprint) {
      for (let i = 0; i < response?.length; i++) {
        if (fingerprint === response[i]?.account?.id) {
          return true; // Duplicate found
        }
      }
    }

    return false; // No duplicate found
  };

  const onDrop = useCallback(async (acceptedFiles) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    const totalShares = formData.artist_share + formData.composer_share +
      formData.producer_share + formData.label_share;

    if (totalShares !== 100) {
      alert('Total shares must equal 100%');
      return;
    }

    setIsSubmitting(true);

    try {
      const recordingData = {
        length: formData.length,
        releaseYear: formData.release_year,
        artistName: formData.artist_name,
        artistShare: formData.artist_share,
        composerName: formData.composer_name,
        composerPubkey: formData.composer_pubkey || Keypair.generate().publicKey.toBase58(),
        composerShare: formData.composer_share,
        producerName: formData.producer_name,
        producerPubkey: formData.producer_pubkey || Keypair.generate().publicKey.toBase58(),
        producerShare: formData.producer_share,
        labelName: formData.label_name,
        labelPubkey: formData.label_pubkey || Keypair.generate().publicKey.toBase58(),
        labelShare: formData.label_share,
        id: fingerprint,
        title: formData.title,
        album: formData.album,
      };

      const result = await addRecording(recordingData);

      if (result.success) {
        alert('Recording registered successfully!');
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Failed to register recording:', error);
      alert('Failed to register recording. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: FileMusic,
      label: 'Analyzing audio file',
      status: verificationProgress >= 15 ? 'complete' : verificationProgress > 0 ? 'processing' : 'pending'
    },
    {
      icon: AlertTriangle,
      label: 'Checking content',
      status: verificationProgress >= 40 ? 'complete' : verificationProgress > 30 ? 'processing' : 'pending'
    },
    {
      icon: Hash,
      label: 'Generating audio fingerprint',
      status: verificationProgress >= 60 ? 'complete' : verificationProgress > 40 ? 'processing' : 'pending'
    },
    {
      icon: Shield,
      label: 'Verifying on blockchain',
      status: verificationProgress >= 80 ? 'complete' : verificationProgress > 60 ? 'processing' : 'pending'
    },
    {
      icon: CheckCircle,
      label: 'Creating verification certificate',
      status: verificationProgress >= 100 ? 'complete' : verificationProgress > 80 ? 'processing' : 'pending'
    }
  ];

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="mx-auto h-16 w-16 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-900 mt-6">
            Connect your wallet to register your music
          </h1>
          <button
            onClick={connect}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors duration-200"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            Register Your Music
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Upload, verify, and register your music in one place
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <Upload className="text-purple-600 h-7 w-7" />
                Upload & Verify
              </h2>
              {verificationStatus === 'success' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Verified
                </span>
              )}
            </div>

            {activeSection === 'upload' && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${isDragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload className="mx-auto h-16 w-16 text-purple-400" />
                  <div className="mt-6 space-y-2">
                    <p className="text-lg text-gray-600">
                      {isDragActive ? (
                        'Drop your audio file here...'
                      ) : (
                        <>
                          <span className="text-purple-600 font-medium">
                            Click to upload
                          </span>
                          {' or drag and drop'}
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">MP3, WAV up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Progress */}
            <AnimatePresence>
              {file && verificationStatus !== 'idle' && (
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
                        animate={{ width: `${verificationProgress}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      />
                    </div>
                  </div>

                  {/* Content Analysis Results */}
                  {contentAnalysis && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mt-6 p-4 ${contentAnalysis.isExplicit ? 'bg-red-50' : 'bg-green-50'
                        } rounded-lg flex items-start gap-3`}
                    >
                      {contentAnalysis.isExplicit ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${contentAnalysis.isExplicit ? 'text-red-800' : 'text-green-800'
                          }`}>
                          {contentAnalysis.isExplicit ? 'Explicit Content Detected' : 'Content Analysis Complete'}
                        </p>
                        {contentAnalysis.reason && (
                          <p className={`mt-1 text-sm ${contentAnalysis.isExplicit ? 'text-red-600'
                            : 'text-green-600'
                            }`}>
                            {contentAnalysis.reason}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Error Handling */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 p-4 bg-red-50 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Error during verification
                        </p>
                        <p className="mt-1 text-sm text-red-600">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Form Section */}
          {activeSection === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3 mb-6">
                <Music className="text-purple-600 h-7 w-7" />
                Song Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'title', label: 'Song Title', type: 'text', required: true },
                    { id: 'artist_name', label: 'Artist Name', type: 'text', required: true },
                    { id: 'album', label: 'Album', type: 'text' },
                    { id: 'release_year', label: 'Release Year', type: 'number', required: true },
                    { id: 'length', label: 'Length (seconds)', type: 'number', required: true },
                    { id: 'artist_share', label: 'Artist Share (%)', type: 'number', required: true },
                    { id: 'composer_name', label: 'Composer Name', type: 'text' },
                    { id: 'composer_share', label: 'Composer Share (%)', type: 'number' },
                    { id: 'producer_name', label: 'Producer Name', type: 'text' },
                    { id: 'producer_share', label: 'Producer Share (%)', type: 'number' },
                    { id: 'label_name', label: 'Label Name', type: 'text' },
                    { id: 'label_share', label: 'Label Share (%)', type: 'number' },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.id}
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      'Register Song'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UnifiedSongRegistration;
                            