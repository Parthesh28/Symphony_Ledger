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
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();

      const [recordingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("recording"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
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
          recordingAccount,
          signer: wallet.publicKey,
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
    newLabelName: string,
    newLabelPubkey: string,
    newLabelShare: number
  ) => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();

      const [recordingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("recording"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .transferRights(
          newLabelName,
          new PublicKey(newLabelPubkey),
          newLabelShare
        )
        .accounts({
          recordingAccount,
          signer: wallet.publicKey,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error transferring rights:", error);
      return { success: false, error };
    }
  };

  const distributeRoyalties = async (
    amount: number,
    recordingAccountPubkey: string,
    artistPubkey: string,
    composerPubkey: string,
    producerPubkey: string,
    labelPubkey: string
  ) => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();

      const tx = await program.methods
        .distributeRoyalties(new BN(amount))
        .accounts({
          recordingAccount: new PublicKey(recordingAccountPubkey),
          payer: wallet.publicKey,
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

  const createTicketSale = async (
    recordingId: string,
    ticketPrice: number,
    totalTickets: number,
    eventDate: number,
    venue: string
  ) => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();

      const [recordingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("recording"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const [ticketSaleAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket-sale"), recordingAccount.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createTicketSale(
          recordingId,
          new BN(ticketPrice),
          totalTickets,
          new BN(eventDate),
          venue
        )
        .accounts({
          ticketSaleAccount,
          recordingAccount,
          authority: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error creating ticket sale:", error);
      return { success: false, error };
    }
  };

  const purchaseTicket = async (
    quantity: number,
    authority: PublicKey
  ) => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();

      const [ticketSaleAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket-sale"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const [ticketPurchaseAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket-purchase"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .purchaseTicket(quantity)
        .accounts({
          ticketSaleAccount,
          ticketPurchaseAccount,
          buyer: wallet.publicKey,
          authority,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, signature: tx };
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      return { success: false, error };
    }
  };

  const fetchAllRecordings = async () => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();
      return await program.account.recording.all();
    } catch (error) {
      console.error("Error fetching recordings:", error);
      return { success: false, error };
    }
  };
  const fetchAllShows = async () => {
    try {
      if (!wallet) throw new Error("Wallet not connected");
      const program = getProgram();
      return await program.account.ticketSale.all();
    } catch (error) {
      console.error("Error fetching recordings:", error);
      return { success: false, error };
    }
  };

  return {
    addRecording,
    transferRights,
    distributeRoyalties,
    createTicketSale,
    purchaseTicket,
    fetchAllRecordings,
    fetchAllShows
  };
};