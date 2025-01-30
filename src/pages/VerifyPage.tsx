import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Shield, CheckCircle, Music, Users,
  Loader2, Hash, AlertCircle, ChevronDown
} from 'lucide-react';
import { useSymphonyProgram } from '../smart';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { AudioFingerprinter } from '../types/audioFingerprint';

const UnifiedSongRegistration = () => {
  // File and verification states
  const [file, setFile] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadState, setUploadState] = useState(false);

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('upload');

  // Hooks
  const { fetchAllRecordings, addRecording } = useSymphonyProgram();
  const { connected } = useWallet();
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

      setVerificationProgress(20);
      const fingerprint = await fingerprinterRef.current?.generateFingerprint(file);
      setVerificationProgress(40);

      if (fingerprint) {
        setFingerprint(fingerprint);
        const isMatch = await compareFP(file);

        if (!uploadState) {
          setVerificationStatus('success');
          setVerificationProgress(100);
          setActiveSection('form');
        } else {
          setVerificationStatus('error');
          setError('No matching recording found.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing audio file');
      setVerificationStatus('error');
    }
  };

  const compareFP = async (file) => {
    const response = await fetchAllRecordings();
    const fingerprint = await fingerprinterRef.current?.generateFingerprint(file);

    if (fingerprint) {
      for (let i = 0; i < response?.length; i++) {
        if (fingerprint === response[i]?.account?.id) {
          setUploadState(false);
          return true;
        }
      }
    }

    setUploadState(true);
    return false;
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
      'audio/*': ['.mp3', '.wav'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
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
        id: formData.id,
        title: formData.title,
        album: formData.album,
        fingerprint
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            Register Your Music
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Upload, verify, and register your music in one place
          </p>
        </div>

        {/* Main Content */}
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
                  <div className="space-y-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationProgress}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      />
                    </div>

                    {verificationStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-green-50 rounded-lg flex items-start gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Verification Successful
                          </p>
                          <p className="mt-1 text-sm text-green-600">
                            Please proceed to fill in the song details below.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {verificationStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-50 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            Verification Failed
                          </p>
                          <p className="mt-1 text-sm text-red-600">
                            {error || 'An error occurred during verification.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Registration Form */}
          {verificationStatus === 'success' && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              onSubmit={handleSubmit}
            >
              {/* Song Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Music className="text-purple-600 h-7 w-7" />
                  Song Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Album
                    </label>
                    <input
                      type="text"
                      name="album"
                      value={formData.album}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (seconds)
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Release Year
                    </label>
                    <input
                      type="number"
                      name="release_year"
                      value={formData.release_year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contributors Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="text-purple-600 h-7 w-7" />
                  Contributors & Shares
                </h2>

                {/* Artist Details */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Artist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="artist_name"
                      value={formData.artist_name}
                      onChange={handleChange}
                      placeholder="Artist Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="number"
                      name="artist_share"
                      value={formData.artist_share}
                      onChange={handleChange}
                      placeholder="Artist Share (%)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Composer Details */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Composer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="composer_name"
                      value={formData.composer_name}
                      onChange={handleChange}
                      placeholder="Composer Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      name="composer_pubkey"
                      value={formData.composer_pubkey}
                      onChange={handleChange}
                      placeholder="Composer Wallet Address"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="number"
                      name="composer_share"
                      value={formData.composer_share}
                      onChange={handleChange}
                      placeholder="Composer Share (%)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Producer Details */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Producer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="producer_name"
                      value={formData.producer_name}
                      onChange={handleChange}
                      placeholder="Producer Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      name="producer_pubkey"
                      value={formData.producer_pubkey}
                      onChange={handleChange}
                      placeholder="Producer Wallet Address"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="number"
                      name="producer_share"
                      value={formData.producer_share}
                      onChange={handleChange}
                      placeholder="Producer Share (%)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Label Details */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Label</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="label_name"
                      value={formData.label_name}
                      onChange={handleChange}
                      placeholder="Label Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      name="label_pubkey"
                      value={formData.label_pubkey}
                      onChange={handleChange}
                      placeholder="Label Wallet Address"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                    <input
                      type="number"
                      name="label_share"
                      value={formData.label_share}
                      onChange={handleChange}
                      placeholder="Label Share (%)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Song'
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSongRegistration;