import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import VerifyPage from './pages/VerifyPage';
import MySongsPage from './pages/MySongsPage';
import EarningsPage from './pages/EarningsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="verify" element={<VerifyPage />} />
        <Route path="my-songs" element={<MySongsPage />} />
        <Route path="earnings" element={<EarningsPage />} />
      </Route>
    </Routes>
  );
}

export default App;