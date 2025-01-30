import React, { useState } from "react";

interface TransferRightsProps {
  songData: {
    id: string;
    title: string;
    currentAddress: string;
    shares: number;
    label: string;
  };
  userAddress: string;
}

export default function TransferRights({
  songData,
  userAddress,
}: TransferRightsProps) {
  const [newAddress, setNewAddress] = useState("");
  const [newShares, setNewShares] = useState(songData.shares);
  const [newLabel, setNewLabel] = useState(songData.label);
  const [error, setError] = useState("");

  const isOwner =
    userAddress.toLowerCase() === songData.currentAddress.toLowerCase();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      setError("Only the current owner can transfer rights");
      return;
    }

    try {
      // Example: await transferRights(songData.id, newAddress, newShares, newLabel);
      console.log("Rights transferred successfully");
    } catch (err) {
      setError("Failed to transfer rights");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">
        Transfer Song Rights
      </h2>

      {/* Song Info */}
      <div className="mb-6 bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900">
          {songData.title}
        </h3>
        <p className="text-sm text-purple-600">
          Current Owner: {songData.currentAddress}
        </p>
      </div>

      {!isOwner && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-sm text-red-700">
            You are not the owner of this song and cannot transfer rights.
          </p>
        </div>
      )}

      <form onSubmit={handleTransfer} className="space-y-4">
        {/* New Address Input */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-purple-700"
          >
            New Owner Address
          </label>
          <input
            type="text"
            id="address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            placeholder="0x..."
            required
            disabled={!isOwner}
          />
        </div>

        {/* Shares Input */}
        <div>
          <label
            htmlFor="shares"
            className="block text-sm font-medium text-purple-700"
          >
            Shares (%)
          </label>
          <input
            type="number"
            id="shares"
            value={newShares}
            onChange={(e) => setNewShares(Number(e.target.value))}
            min="0"
            max="100"
            className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            required
            disabled={!isOwner}
          />
        </div>

        {/* Label Input */}
        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-purple-700"
          >
            Label
          </label>
          <input
            type="text"
            id="label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            required
            disabled={!isOwner}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={!isOwner}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${
              isOwner
                ? "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Transfer Rights
        </button>
      </form>
    </div>
  );
}
