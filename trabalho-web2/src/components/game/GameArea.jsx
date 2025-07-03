import React from 'react';
import QuizView from './QuizView';
import MemoryView from './MemoryView';
import ClassificationView from './ClassificationView';
import SequenceView from './SequenceView';
import { Card, CardContent } from '@/components/ui/card';

const GameArea = ({ game, gameState, onAnswer }) => {
  const currentData = gameState.gameData[gameState.currentQuestion];

  if (!currentData) {
    return (
      <Card className="w-full max-w-4xl p-8 text-center">
        <CardContent>
          <p>Carregando jogo...</p>
        </CardContent>
      </Card>
    );
  }

  const renderGameView = () => {
    switch (game.type) {
      case 'quiz':
        return <QuizView data={currentData} gameState={gameState} onAnswer={onAnswer} />;
      case 'memory':
        return <MemoryView data={currentData} allData={gameState.gameData} gameState={gameState} onAnswer={onAnswer} />;
      case 'classification':
      case 'dragdrop':
        return <ClassificationView data={currentData} categories={Object.keys(game.data)} gameState={gameState} onAnswer={onAnswer} />;
      case 'sequence':
        return <SequenceView data={currentData} allData={game.data} gameState={gameState} onAnswer={onAnswer} />;
      default:
        return <p>Tipo de jogo não suportado.</p>;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {renderGameView()}
    </div>
  );
};

export default GameArea;