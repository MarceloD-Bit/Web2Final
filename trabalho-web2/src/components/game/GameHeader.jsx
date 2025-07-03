import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GameHeader = ({ game, gameState }) => {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="max-w-4xl mx-auto w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={() => navigate('/library')}
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-center">{game.title}</h1>
        <div className="w-10"></div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 text-primary">
                <Target className="w-4 h-4" />
                <span className="text-lg font-bold">{gameState.score}</span>
              </div>
              <div className="text-muted-foreground text-xs">Pontos</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg font-bold">{gameState.correctAnswers}</span>
              </div>
              <div className="text-muted-foreground text-xs">Acertos</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Zap className="w-4 h-4" />
                <span className="text-lg font-bold">{gameState.streak}</span>
              </div>
              <div className="text-muted-foreground text-xs">Sequência</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold">{formatTime(gameState.timeElapsed)}</span>
              </div>
              <div className="text-muted-foreground text-xs">Tempo</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-muted-foreground text-sm">
                {gameState.currentQuestion + 1} / {gameState.gameData.length}
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${((gameState.currentQuestion + 1) / gameState.gameData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default GameHeader;