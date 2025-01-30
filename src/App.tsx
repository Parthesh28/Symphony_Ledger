import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import VerifyPage from "./pages/VerifyPage";
import MySongsPage from "./pages/MySongsPage";
import EarningsPage from "./pages/EarningsPage";
import { Buffer } from "buffer";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import SolanaWalletModal from "./components/SolanaWalletModal";
import { ExploreShows } from "./pages/ExploreShows";
import { ShowTickets } from "./pages/ShowTickets";
import ConcertDetails from "./pages/ConcertDetails";
import MusicMarketplace from "./pages/Royalty";
import TransferRights from "./pages/TransferRights";

function App() {
  window.Buffer = Buffer;
  return (
    <Context>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="shows" element={<ExploreShows />} />
          <Route path="my-songs" element={<MySongsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="tickets" element={<ShowTickets />} />
          <Route path="royalty" element={<MusicMarketplace />} />
          <Route path="rights" element={<TransferRights />} />
          <Route path="concert/:id" element={<ConcertDetails />} />
        </Route>
      </Routes>
      <SolanaWalletModal />
    </Context>
  );
}

const Context = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
