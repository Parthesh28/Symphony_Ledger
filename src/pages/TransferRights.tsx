import React, { useState, useEffect } from "react";
import { useSymphonyProgram } from "../smart";
import { PublicKey } from "@solana/web3.js";

interface Recording {
  publicKey: PublicKey;
  account: {
    title: string;
    labelName: string;
    labelShare: number;
    labelPubkey: PublicKey;
  };
}

const TransferRights: React.FC = () => {
  const { transferRights, fetchAllRecordings } = useSymphonyProgram();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelPubkey, setNewLabelPubkey] = useState("");
  const [newLabelShare, setNewLabelShare] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const allRecordings = await fetchAllRecordings();
      if (Array.isArray(allRecordings)) {
        setRecordings(allRecordings);
        if (allRecordings.length > 0) {
          setSelectedRecording(allRecordings[0]);
        } else {
          setSelectedRecording(null);
        }
      } else {
        throw new Error("Invalid recordings data");
      }
    } catch (err) {
      setError("Failed to load recordings");
      console.error("Error loading recordings:", err);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecording) {
      setError("Please select a recording");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const shareValue = parseInt(newLabelShare);
      if (isNaN(shareValue) || shareValue <= 0 || shareValue > 100) {
        throw new Error("Share percentage must be between 1 and 100");
      }

      const result = await transferRights(
        newLabelName,
        newLabelPubkey,
        shareValue
      );

      if (result?.success) {
        setSuccess(
          `Rights transferred successfully for "${selectedRecording.account.title}"!`
        );
        setNewLabelName("");
        setNewLabelPubkey("");
        setNewLabelShare("");
        await loadRecordings();
      } else {
        throw new Error(result?.error?.toString() || "Transfer failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingChange = (publicKeyString: string) => {
    const selected = recordings.find(
      (rec) => rec.publicKey.toString() === publicKeyString
    );
    setSelectedRecording(selected || null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">
        Transfer Rights
      </h2>

      <div className="mb-6">
        <label
          htmlFor="recording-select"
          className="block text-sm font-medium text-purple-700 mb-2"
        >
          Select Recording
        </label>
        <select
          id="recording-select"
          className="w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          value={
            selectedRecording ? selectedRecording.publicKey.toString() : ""
          }
          onChange={(e) => handleRecordingChange(e.target.value)}
        >
          {recordings.length === 0 && (
            <option value="">No recordings available</option>
          )}
          {recordings.map((recording) => (
            <option
              key={recording.publicKey.toString()}
              value={recording.publicKey.toString()}
            >
              {recording.account.title}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label
            htmlFor="newLabelName"
            className="block text-sm font-medium text-purple-700"
          >
            New Label Name
          </label>
          <input
            type="text"
            id="newLabelName"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newLabelPubkey"
            className="block text-sm font-medium text-purple-700"
          >
            New Label Public Key
          </label>
          <input
            type="text"
            id="newLabelPubkey"
            value={newLabelPubkey}
            onChange={(e) => setNewLabelPubkey(e.target.value)}
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
            placeholder="Enter Solana public key"
          />
        </div>

        <div>
          <label
            htmlFor="newLabelShare"
            className="block text-sm font-medium text-purple-700"
          >
            New Label Share (%)
          </label>
          <input
            type="number"
            id="newLabelShare"
            value={newLabelShare}
            onChange={(e) => setNewLabelShare(e.target.value)}
            min="1"
            max="100"
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedRecording}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Transfer Rights"}
        </button>
      </form>
    </div>
  );
};

export default TransferRights;
