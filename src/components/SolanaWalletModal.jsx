import React, { useState, useEffect, useCallback, useRef } from "react"
import { Send, Copy, LogOut, CheckCircle } from "lucide-react"
import * as web3 from "@solana/web3.js"

// Custom Button Component
const Button = ({ children, variant = "primary", disabled, onClick, className = "" }) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white",
        secondary: "bg-gray-800 hover:bg-gray-700 text-white",
        ghost: "bg-transparent hover:bg-white/10 text-white",
    }

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    )
}

// Custom Input Component
const Input = ({ error, ...props }) => (
    <input
        {...props}
        className={`w-full px-4 py-2 bg-gray-800/50 border ${error ? "border-red-500" : "border-gray-700"} 
    rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
    transition-all duration-200`}
    />
)

// Custom Alert Component
const Alert = ({ variant = "info", children }) => {
    const variants = {
        info: "bg-blue-500/20 border-blue-500 text-blue-200",
        error: "bg-red-500/20 border-red-500 text-red-200",
        success: "bg-green-500/20 border-green-500 text-green-200",
    }

    return <div className={`p-4 rounded-lg border ${variants[variant]} text-sm`}>{children}</div>
}

// Transaction Success Component
const TransactionSuccess = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-green-400 animate-successPop" />
            <p className="text-green-400 font-medium">Transaction Successful!</p>
        </div>
    )
}

const SolanaWalletModal = () => {
    const connectionRef = useRef(
        new web3.Connection("https://devnet.helius-rpc.com/?api-key=7b81edb9-bad5-4dad-a030-b5cad7072fd3"),
    )

    const TIP_AMOUNT = 0.1

    const [isConnected, setIsConnected] = useState(false)
    const [publicKey, setPublicKey] = useState("")
    const [balance, setBalance] = useState("0.000000")
    const [showSuccess, setShowSuccess] = useState(false)

    const [uiState, setUiState] = useState({
        isLoading: false,
        error: "",
        tokens: [],
        isSending: false,
        destinationAddress: "",
        showSendForm: false,
        sendStatus: "",
        addressError: "",
        showModal: false,
    })

    const updateUiState = useCallback((updates) => {
        setUiState((prev) => ({ ...prev, ...updates }))
    }, [])

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const fetchBalance = useCallback(async (walletPublicKey) => {
        try {
            if (!walletPublicKey) return

            const pubKey = new web3.PublicKey(walletPublicKey)
            const balanceAmount = await connectionRef.current.getBalance(pubKey)
            const solBalance = (balanceAmount / web3.LAMPORTS_PER_SOL).toFixed(6)

            setBalance(solBalance)
            setUiState((prev) => ({
                ...prev,
                tokens: [{ symbol: "SOL", balance: solBalance, icon: "🌞" }],
            }))
        } catch (error) {
            console.error("Error fetching balance:", error)
            updateUiState({ error: "Failed to fetch balance" })
        }
    }, [])

    const handleDisconnect = useCallback(() => {
        const { solana } = window
        if (solana) {
            solana.disconnect()
        }
        setIsConnected(false)
        setPublicKey("")
        setBalance("0.000000")
        setUiState((prev) => ({
            ...prev,
            tokens: [],
            showSendForm: false,
            error: "",
            showModal: false,
        }))
    }, [])

    const handleSuccessComplete = useCallback(() => {
        setShowSuccess(false)
        updateUiState({ showSendForm: false })
    }, [])

    const handleSend = async () => {
        try {
            updateUiState({ addressError: "", sendStatus: "", isSending: true })

            if (!isValidSolanaAddress(uiState.destinationAddress)) {
                updateUiState({ addressError: "Invalid Solana address format" })
                return
            }

            const { solana } = window
            if (!solana) throw new Error("Wallet not connected")

            const transaction = new web3.Transaction()
            const senderPubKey = new web3.PublicKey(publicKey)
            const toPubKey = new web3.PublicKey(uiState.destinationAddress)
            const amountInLamports = TIP_AMOUNT * web3.LAMPORTS_PER_SOL

            transaction.add(
                web3.SystemProgram.transfer({
                    fromPubkey: senderPubKey,
                    toPubkey: toPubKey,
                    lamports: amountInLamports,
                }),
            )

            const { blockhash } = await connectionRef.current.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = senderPubKey

            const signed = await solana.signAndSendTransaction(transaction)
            await connectionRef.current.confirmTransaction(signed.signature)

            setShowSuccess(true)
            updateUiState({
                destinationAddress: "",
                sendStatus: "",
            })

            await fetchBalance(publicKey)
        } catch (error) {
            console.error("Error sending transaction:", error)
            updateUiState({ sendStatus: `Error: ${error.message}` })
        } finally {
            updateUiState({ isSending: false })
        }
    }

    const isValidSolanaAddress = (address) => {
        try {
            new web3.PublicKey(address)
            return true
        } catch {
            return false
        }
    }

    const handleConnect = async () => {
        try {
            const { solana } = window
            if (!solana) {
                updateUiState({ error: "Please install Phantom wallet" })
                return
            }

            updateUiState({ isLoading: true, error: "" })
            const response = await solana.connect()

            setPublicKey(response.publicKey.toString())
            setIsConnected(true)

            await fetchBalance(response.publicKey.toString())

            // Open the modal after successful connection
            updateUiState({ showModal: true })
        } catch (error) {
            updateUiState({ error: error.message })
        } finally {
            updateUiState({ isLoading: false })
        }
    }

    useEffect(() => {
        const { solana } = window

        if (solana?.isPhantom) {
            if (solana.isConnected) {
                const pubKey = solana.publicKey.toString()
                setPublicKey(pubKey)
                setIsConnected(true)
                fetchBalance(pubKey)
            }

            solana.on("connect", () => {
                if (solana.publicKey) {
                    const pubKey = solana.publicKey.toString()
                    setPublicKey(pubKey)
                    setIsConnected(true)
                    fetchBalance(pubKey)
                }
            })

            solana.on("disconnect", handleDisconnect)

            return () => {
                solana.removeAllListeners("connect")
                solana.removeAllListeners("disconnect")
            }
        } else {
            updateUiState({ error: "Please install Phantom wallet" })
        }
    }, [fetchBalance, handleDisconnect])

    useEffect(() => {
        let intervalId

        if (isConnected && publicKey) {
            intervalId = setInterval(() => {
                fetchBalance(publicKey)
            }, 30000)
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [isConnected, publicKey, fetchBalance])

    if (!isConnected) {
        return (
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={handleConnect}
                    disabled={uiState.isLoading}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                >
                    {uiState.isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                        </svg>
                    )}
                </button>
            </div>
        )
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${uiState.showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => updateUiState({ showModal: false })}
            ></div>
            <div
                className={`fixed inset-0 flex items-center justify-center transition-opacity ${uiState.showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                <div
                    className="w-full max-w-md mx-auto bg-gray-900 rounded-xl p-6 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400">
                                A1
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-white">
                                    {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                                </span>
                                <Copy
                                    className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
                                    onClick={() => copyToClipboard(publicKey)}
                                />
                            </div>
                        </div>
                        <Button variant="ghost" onClick={handleDisconnect} className="text-red-400 hover:text-red-300">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {balance} <span className="text-purple-400">SOL</span>
                        </h1>
                    </div>

                    {!uiState.showSendForm ? (
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center space-x-2 py-4"
                            onClick={() => updateUiState({ showSendForm: true, addressError: "", sendStatus: "" })}
                        >
                            <Send className="w-5 h-5 text-purple-400" />
                            <span>Send {TIP_AMOUNT} SOL</span>
                        </Button>
                    ) : showSuccess ? (
                        <TransactionSuccess onComplete={handleSuccessComplete} />
                    ) : (
                        <div className="space-y-4">
                            <Input
                                placeholder="Enter destination address"
                                value={uiState.destinationAddress}
                                onChange={(e) =>
                                    updateUiState({
                                        destinationAddress: e.target.value,
                                        addressError: "",
                                    })
                                }
                                error={uiState.addressError}
                            />
                            {uiState.addressError && <p className="text-red-500 text-sm">{uiState.addressError}</p>}
                            <div className="flex space-x-3">
                                <Button
                                    onClick={handleSend}
                                    disabled={uiState.isSending || !uiState.destinationAddress}
                                    className="flex-1"
                                >
                                    {uiState.isSending ? "Sending..." : `Send ${TIP_AMOUNT} SOL`}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        updateUiState({
                                            showSendForm: false,
                                            destinationAddress: "",
                                            sendStatus: "",
                                            addressError: "",
                                        })
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                            {uiState.sendStatus && uiState.sendStatus.includes("Error") && (
                                <Alert variant="error">{uiState.sendStatus}</Alert>
                            )}
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        {uiState.tokens.map((token) => (
                            <div key={token.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
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
                </div>
            </div>
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => updateUiState({ showModal: true })}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                    </svg>
                </button>
            </div>
        </>
    )
}

export default SolanaWalletModal