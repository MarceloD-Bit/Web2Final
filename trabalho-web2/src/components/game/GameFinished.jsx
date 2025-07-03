import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GameFinished = ({ game, gameState, onRestart }) => {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Helmet>
        <title>Resultado - {game.title} - EduGames</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl mx-auto text-center w-full">
          <CardHeader>
            <CardTitle className="text-4xl">Parabéns!</CardTitle>
            <CardDescription className="text-lg">Você completou o jogo!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{gameState.score}</div>
                <div className="text-muted-foreground text-sm">Pontuação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{gameState.correctAnswers}</div>
                <div className="text-muted-foreground text-sm">Acertos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(gameState.timeElapsed)}</div>
                <div className="text-muted-foreground text-sm">Tempo</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{gameState.maxStreak}</div>
                <div className="text-muted-foreground text-sm">Melhor Sequência</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={onRestart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Jogar Novamente
              </Button>
              <Button onClick={() => navigate(`/ranking/${game.id}`)} variant="secondary">
                <Trophy className="w-4 h-4 mr-2" />
                Ver Ranking
              </Button>
              <Button 
                onClick={() => navigate('/library')} 
                variant="outline"
              >
                Voltar à Biblioteca
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GameFinished;