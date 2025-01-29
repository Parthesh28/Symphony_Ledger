import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// Import your IDL
import idl from "../new.json";
import { Symphonyledger } from "./new";

// Program ID from your IDL
const PROGRAM_ID = new PublicKey(
  "Feq9pcxUbG3Yc8hTMN6hhDihrhN4XNXiK3hxkHQRB1qN"
);

// Custom hook for Anchor program
export const useSymphonyProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const getProgram = () => {
    if (!wallet) throw new Error("Wallet not connected");

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    return new Program(idl as Symphonyledger, provider);
  };

  const addRecording = async (recordingData: {
    length: number;
    releaseYear: number;
    artistName: string;
    artistShare: number;
    composerName: string;
    composerPubkey: string;
    composerShare: number;
    producerName: string;
    producerPubkey: string;
    producerShare: number;
    labelName: string;
    labelPubkey: string;
    labelShare: number;
    id: string;
    title: string;
    album: string;
  }) => {
    try {
      if (!wallet) return;
      const program = getProgram();

      const PROGRAM_ID = new PublicKey(
        "Feq9pcxUbG3Yc8hTMN6hhDihrhN4XNXiK3hxkHQRB1qN"
      );

      // Seed for the PDA
      const SEED = "recording";

      // Generate the PDA
      const [recordingAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED), wallet.publicKey.toBuffer()], // Seeds (must be a buffer or array of buffers)
        PROGRAM_ID // Program ID
      );

      console.log(
        recordingData.length,
        recordingData.releaseYear,
        recordingData.artistName,
        recordingData.artistShare,
        recordingData.composerName,
        new PublicKey(recordingData.composerPubkey),
        recordingData.composerShare,
        recordingData.producerName,
        new PublicKey(recordingData.producerPubkey),
        recordingData.producerShare,
        recordingData.labelName,
        new PublicKey(recordingData.labelPubkey),
        recordingData.labelShare,
        recordingData.id,
        recordingData.title,
        recordingData.album
      );

      const tx = await program.methods
        .addRecording(
          recordingData.length,
          recordingData.releaseYear,
          recordingData.artistName,
          recordingData.artistShare,
          recordingData.composerName,
          new PublicKey(recordingData.composerPubkey),
          recordingData.composerShare,
          recordingData.producerName,
          new PublicKey(recordingData.producerPubkey),
          recordingData.producerShare,
          recordingData.labelName,
          new PublicKey(recordingData.labelPubkey),
          recordingData.labelShare,
          recordingData.id,
          recordingData.title,
          recordingData.album
        )
        .accounts({
          recordingAccount: recordingAccount,
          signer: wallet?.publicKey!,
          feeCollector: new PublicKey(
            "DuNKWq3a93BysBvKS2xR9hcJCVfmT494F2RiFM7jpt8b"
          ),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error adding recording:", error);
      return { success: false, error };
    }
  };

  const transferRights = async (
    recordingPubkey: string,
    newLabelName: string,
    newLabelPubkey: string,
    newLabelShare: number
  ) => {
    try {
      if (!wallet) return;
      const program = getProgram();

      const PROGRAM_ID = new PublicKey(
        "Feq9pcxUbG3Yc8hTMN6hhDihrhN4XNXiK3hxkHQRB1qN"
      );

      // Seed for the PDA
      const SEED = "recording";

      // Generate the PDA
      const [recordingAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED), wallet.publicKey.toBuffer()], // Seeds (must be a buffer or array of buffers)
        PROGRAM_ID // Program ID
      );

      const tx = await program.methods
        .transferRights(
          newLabelName,
          new PublicKey(newLabelPubkey),
          newLabelShare
        )
        .accounts({
          recordingAccount,
          signer: wallet?.publicKey!,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error transferring rights:", error);
      return { success: false, error };
    }
  };

  const distributeRoyalties = async (
    recordingPubkey: string,
    amount: number,
    artistPubkey: string,
    composerPubkey: string,
    producerPubkey: string,
    labelPubkey: string
  ) => {
    try {
      if (!wallet) return;
      const program = getProgram();

      const PROGRAM_ID = new PublicKey(
        "Feq9pcxUbG3Yc8hTMN6hhDihrhN4XNXiK3hxkHQRB1qN"
      );

      // Seed for the PDA
      const SEED = "recording";

      // Generate the PDA
      const [recordingAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED), wallet.publicKey.toBuffer()], // Seeds (must be a buffer or array of buffers)
        PROGRAM_ID // Program ID
      );

      const tx = await program.methods
        .distributeRoyalties(new BN(amount))
        .accounts({
          recordingAccount,
          payer: wallet?.publicKey!,
          artistAccount: new PublicKey(artistPubkey),
          composerAccount: new PublicKey(composerPubkey),
          producerAccount: new PublicKey(producerPubkey),
          labelAccount: new PublicKey(labelPubkey),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error distributing royalties:", error);
      return { success: false, error };
    }
  };

  return {
    addRecording,
    transferRights,
    distributeRoyalties,
  };
};
