import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Trophy, Clock, Target, Zap, RotateCcw, Share2, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';
import AudioControls from '@/components/AudioControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GameResultsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games, getGameRanking } = useGame();
  const { toast } = useToast();

  const game = games.find(g => g.id === gameId);
  const ranking = getGameRanking(gameId);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Jogo não encontrado</h2>
          <Button onClick={() => navigate('/library')}>
            Voltar à Biblioteca
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/play/${game.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: `Compartilhe este jogo com seus amigos!`,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: "Desempenho Excepcional!", color: "text-primary" };
    if (accuracy >= 75) return { message: "Ótimo Desempenho!", color: "text-green-500" };
    if (accuracy >= 60) return { message: "Bom Desempenho!", color: "text-foreground" };
    return { message: "Continue Praticando!", color: "text-muted-foreground" };
  };

  return (
    <>
      <Helmet>
        <title>Resultados - {game.title} - EduGames</title>
        <meta name="description" content={`Veja seus resultados no jogo ${game.title}`} />
      </Helmet>

      <div className="min-h-screen p-4">
        <AudioControls />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              onClick={() => navigate('/library')}
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Resultados do Jogo</h1>
              <p className="text-muted-foreground">{game.title}</p>
            </div>
          </div>

          <Card className="mb-8 text-center">
            <CardHeader>
              <CardTitle className="text-4xl">Parabéns!</CardTitle>
            </CardHeader>
            <CardContent>
              {ranking.length > 0 && (
                <>
                  <div className={`text-2xl font-bold mb-8 ${getPerformanceMessage(ranking[0].accuracy).color}`}>
                    {getPerformanceMessage(ranking[0].accuracy).message}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Trophy className="w-6 h-6 text-primary" />
                        <span className="text-3xl font-bold text-primary">{ranking[0].score}</span>
                      </div>
                      <div className="text-muted-foreground">Pontuação</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Target className="w-6 h-6" />
                        <span className="text-3xl font-bold">{ranking[0].correctAnswers}</span>
                      </div>
                      <div className="text-muted-foreground">Acertos</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Clock className="w-6 h-6" />
                        <span className="text-3xl font-bold">{formatTime(ranking[0].timeElapsed)}</span>
                      </div>
                      <div className="text-muted-foreground">Tempo</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Zap className="w-6 h-6" />
                        <span className="text-3xl font-bold">{ranking[0].maxStreak}</span>
                      </div>
                      <div className="text-muted-foreground">Melhor Sequência</div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate(`/play/${game.id}`)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Jogar Novamente
                </Button>
                <Button onClick={() => navigate(`/ranking/${game.id}`)} variant="secondary">
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Ranking Completo
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Jogo
                </Button>
              </div>
            </CardContent>
          </Card>

          {ranking.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Top 5 Melhores Pontuações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ranking.slice(0, 5).map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between p-4 rounded-lg bg-secondary`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`text-2xl font-bold w-8 text-center ${
                          index === 0 ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{result.playerName}</div>
                          <div className="text-muted-foreground text-sm">
                            {result.accuracy}% precisão • {formatTime(result.timeElapsed)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{result.score}</div>
                        <div className="text-muted-foreground text-sm">pontos</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {ranking.length > 5 && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => navigate(`/ranking/${game.id}`)}
                      variant="outline"
                    >
                      Ver Ranking Completo ({ranking.length} resultados)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default GameResultsPage;