import React, { useState } from "react";
import TransferRights from "../components/TransferRights";

function App() {
  // Example data - in a real app, this would come from your blockchain connection
  const mockSongs = [
    {
      id: "1",
      title: "Summer Breeze",
      currentAddress: "0x123...abc",
      shares: 100,
      label: "Purple Records",
    },
    {
      id: "2",
      title: "Midnight Jazz",
      currentAddress: "0x456...def",
      shares: 80,
      label: "Blue Note",
    },
    {
      id: "3",
      title: "Digital Dreams",
      currentAddress: "0x123...abc",
      shares: 60,
      label: "Future Sounds",
    },
  ];

  const mockUserAddress = "0x123...abc"; // This would come from the connected wallet
  const [selectedSong, setSelectedSong] = useState(mockSongs[0]);

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <label
            htmlFor="song-select"
            className="block text-sm font-medium text-purple-700 mb-2"
          >
            Select Song
          </label>
          <select
            id="song-select"
            className="w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            value={selectedSong.id}
            onChange={(e) =>
              setSelectedSong(
                mockSongs.find((song) => song.id === e.target.value) ||
                  mockSongs[0]
              )
            }
          >
            {mockSongs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title}
              </option>
            ))}
          </select>
        </div>

        <TransferRights songData={selectedSong} userAddress={mockUserAddress} />
      </div>
    </div>
  );
}

export default App;
