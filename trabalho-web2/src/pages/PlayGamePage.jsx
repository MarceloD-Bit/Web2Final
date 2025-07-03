import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useGameLogic } from '@/hooks/useGameLogic';
import AudioControls from '@/components/AudioControls';
import GameHeader from '@/components/game/GameHeader';
import GameArea from '@/components/game/GameArea';
import GameFinished from '@/components/game/GameFinished';
import { Button } from '@/components/ui/button';

const PlayGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { game, gameState, initializeGame, handleAnswer } = useGameLogic(gameId);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Jogo não encontrado</h2>
          <Button onClick={() => navigate('/library')}>Voltar à Biblioteca</Button>
        </div>
      </div>
    );
  }

  if (gameState.isGameFinished) {
    return <GameFinished game={game} gameState={gameState} onRestart={initializeGame} />;
  }

  return (
    <>
      <Helmet>
        <title>Jogando - {game.title} - EduGames</title>
      </Helmet>

      <div className="min-h-screen p-4 flex flex-col">
        <AudioControls />
        <GameHeader game={game} gameState={gameState} />
        <main className="flex-grow flex items-center justify-center">
          <GameArea game={game} gameState={gameState} onAnswer={handleAnswer} />
        </main>
      </div>
    </>
  );
};

export default PlayGamePage;