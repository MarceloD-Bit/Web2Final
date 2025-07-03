
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { GameProvider } from '@/contexts/GameContext';
import { AudioProvider } from '@/contexts/AudioContext';
import HomePage from '@/pages/HomePage';
import CreateGamePage from '@/pages/CreateGamePage';
import PlayGamePage from '@/pages/PlayGamePage';
import GameResultsPage from '@/pages/GameResultsPage';
import RankingPage from '@/pages/RankingPage';
import GameLibraryPage from '@/pages/GameLibraryPage';

function App() {
  return (
    <GameProvider>
      <AudioProvider>
        <Router>
          <Helmet>
            <title>EduGames - Plataforma de Jogos Educativos</title>
            <meta name="description" content="Crie, compartilhe e jogue jogos educativos interativos. Aprenda de forma divertida com nossa plataforma gamificada!" />
          </Helmet>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateGamePage />} />
              <Route path="/library" element={<GameLibraryPage />} />
              <Route path="/play/:gameId" element={<PlayGamePage />} />
              <Route path="/results/:gameId" element={<GameResultsPage />} />
              <Route path="/ranking/:gameId" element={<RankingPage />} />
              
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AudioProvider>
    </GameProvider>
  );
}

export default App;
