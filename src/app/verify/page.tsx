import React from 'react';
import { Upload, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Music</h1>
          <p className="mt-2 text-gray-600">
            Upload your music to verify its authenticity and protect it with blockchain technology
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="audio/*"
                  />
                </label>
                <p className="pl-1 text-gray-500">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                MP3, WAV up to 10MB
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Process</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Analyzing audio fingerprint...</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Checking blockchain records...</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <XCircle className="h-5 w-5 text-gray-400" />
                <span>Generating verification certificate...</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Start Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}