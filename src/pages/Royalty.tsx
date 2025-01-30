import React, { useState, useEffect, useMemo } from "react";
import { Music, Wallet, Search, ChevronDown, X, Disc } from "lucide-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSymphonyProgram } from "../smart";

const MusicMarketplace = () => {
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  const wallet = useAnchorWallet();
  const { fetchAllRecordings, distributeRoyalties } = useSymphonyProgram();

  useEffect(() => {
    const loadRecordings = async () => {
      if (!wallet) {
        setLoading(false);
        return;
      }

      try {
        const fetchedRecordings = await fetchAllRecordings();
        if (fetchedRecordings.success === false) {
          console.error("Error:", fetchedRecordings.error);
          return;
        }
        setRecordings(
          fetchedRecordings.map((r) => {
            return {
              ...r.account,
              publickey: r.publicKey.toBase58(),
            };
          })
        );
      } catch (error) {
        console.error("Error loading recordings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecordings();
  }, [wallet]);

  const filteredRecordings = useMemo(() => {
    return recordings.filter(
      (recording) =>
        recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recordings]);

  const handleRecordingSelect = (recording) => {
    setSelectedRecording(recording);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleSendSol = async () => {
    console.log(selectedRecording);
    if (!solAmount || !selectedRecording) {
      alert("Please select a recording and enter SOL amount");
      return;
    }
    await distributeRoyalties(
      parseInt(solAmount),
      selectedRecording.publickey,
      selectedRecording.artist.pubkey.toBase58(),
      selectedRecording.composer.pubkey.toBase58(),
      selectedRecording.producer.pubkey.toBase58(),
      selectedRecording.label.pubkey.toBase58()
    );
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Wallet className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600">
            Please connect your wallet to view recordings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Music className="w-8 h-8" />
            Send Royalities
          </h1>
        </div>

        <div className="p-8">
          <div className="grid gap-8">
            <div className="relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Disc className="text-purple-600" />
                Select Recording
              </h2>
              <div
                className={`border-2 rounded-xl cursor-pointer relative transition-all duration-200 ${
                  isDropdownOpen
                    ? "border-purple-600 shadow-md"
                    : "border-gray-200 hover:border-purple-400"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {!selectedRecording && !isDropdownOpen && (
                  <div className="p-4 flex items-center justify-between text-gray-500">
                    <span>Choose a recording to support</span>
                    <ChevronDown size={20} />
                  </div>
                )}

                {selectedRecording && !isDropdownOpen && (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedRecording.title}
                        </div>
                        <div className="text-sm text-purple-600">
                          {selectedRecording.artistName}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecording(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {isDropdownOpen && (
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-2.5">
                      <Search className="text-purple-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by track or artist..."
                        className="bg-transparent outline-none flex-1 placeholder-purple-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {isDropdownOpen && (
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      </div>
                    ) : (
                      <>
                        {filteredRecordings.map((recording, index) => (
                          <div
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordingSelect(recording);
                            }}
                            className="p-4 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Music className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {recording.title}
                                </div>
                                <div className="text-sm text-purple-600">
                                  {recording.artistName}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredRecordings.length === 0 && (
                          <div className="p-6 text-gray-500 text-center">
                            No recordings found matching your search
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedRecording && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Wallet className="text-purple-600" />
                  Payment Details
                </h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        value={solAmount}
                        onChange={(e) => setSolAmount(e.target.value)}
                        placeholder="Amount"
                        className="border-2 rounded-lg p-3 w-40 pr-16 focus:border-purple-600 outline-none transition-colors"
                        step="0.1"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-600">
                        SOL
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSendSol}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300"
                  >
                    <Wallet size={20} />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicMarketplace;
