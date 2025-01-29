import React, { useState, useEffect } from "react";
import { Send, Copy, LogOut } from "lucide-react";
import * as web3 from '@solana/web3.js';

const CustomButton = ({ children, variant = "primary", disabled = false, onClick, className = "" }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";
    const variants = {
        primary: "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-600/50",
        ghost: "bg-transparent hover:bg-white/5 text-white",
        danger: "bg-transparent hover:bg-red-500/10 text-red-500"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
};

const CustomInput = ({ error, ...props }) => (
    <input
        {...props}
        className={`w-full px-4 py-3 bg-white/5 border rounded-lg transition-colors duration-200 
    focus:outline-none focus:border-purple-500 text-white placeholder-gray-400
    ${error ? 'border-red-500' : 'border-white/10'}`}
    />
);

const CustomAlert = ({ children, variant = "success" }) => {
    const variants = {
        success: "bg-green-500/10 border-green-500/20 text-green-500",
        error: "bg-red-500/10 border-red-500/20 text-red-500"
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]}`}>
            {children}
        </div>
    );
};

const Tip() {
    const [isConnected, setIsConnected] = useState(false);
    const [publicKey, setPublicKey] = useState("");
    const [balance, setBalance] = useState("0.000000");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [tokens, setTokens] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [destinationAddress, setDestinationAddress] = useState("");
    const [showSendForm, setShowSendForm] = useState(false);
    const [sendStatus, setSendStatus] = useState("");
    const [addressError, setAddressError] = useState("");

    const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=7b81edb9-bad5-4dad-a030-b5cad7072fd3");
    const TIP_AMOUNT = 0.1;

    // ... (keep all the existing logic functions like copyToClipboard, fetchBalance, etc.)

    if (!isConnected) {
        return (
            <div className="w-full max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="text-center">
                    <CustomButton
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Connecting..." : "Connect Wallet"}
                    </CustomButton>
                    {error && (
                        <p className="mt-4 text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                        A1
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">Account 1</span>
                        <Copy
                            className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
                            onClick={() => copyToClipboard(publicKey)}
                        />
                    </div>
                </div>
                <CustomButton
                    variant="danger"
                    onClick={handleDisconnect}
                    className="flex items-center space-x-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                </CustomButton>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">{balance} SOL</h1>
                <p className="text-gray-400 text-sm font-mono">
                    {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </p>
            </div>

            {!showSendForm ? (
                <div className="mb-8">
                    <CustomButton
                        variant="ghost"
                        className="w-full py-6 group"
                        onClick={() => {
                            setShowSendForm(true);
                            setAddressError("");
                            setSendStatus("");
                        }}
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center 
                           group-hover:bg-purple-500/30 transition-colors">
                                <Send className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                            </div>
                            <span className="text-sm">Send (0.1 SOL tip)</span>
                        </div>
                    </CustomButton>
                </div>
            ) : (
                <div className="space-y-4 mb-8">
                    <CustomInput
                        placeholder="Enter destination address"
                        value={destinationAddress}
                        onChange={(e) => {
                            setDestinationAddress(e.target.value);
                            setAddressError("");
                        }}
                        error={addressError}
                    />
                    {addressError && (
                        <p className="text-red-500 text-sm">{addressError}</p>
                    )}
                    <div className="flex gap-3">
                        <CustomButton
                            onClick={handleSend}
                            disabled={isSending || !destinationAddress || addressError}
                            className="flex-1"
                        >
                            {isSending ? "Sending..." : "Send 0.1 SOL"}
                        </CustomButton>
                        <CustomButton
                            variant="ghost"
                            onClick={() => {
                                setShowSendForm(false);
                                setDestinationAddress("");
                                setSendStatus("");
                                setAddressError("");
                            }}
                        >
                            Cancel
                        </CustomButton>
                    </div>
                    {sendStatus && (
                        <CustomAlert variant={sendStatus.includes("Error") ? "error" : "success"}>
                            {sendStatus}
                        </CustomAlert>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {tokens.map((token) => (
                    <div
                        key={token.symbol}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/8 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{token.icon}</span>
                            <div>
                                <p className="font-medium text-white">{token.symbol}</p>
                                <p className="text-sm text-gray-400">{token.balance}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <p className="mt-4 text-red-500 text-sm text-center">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Tip();