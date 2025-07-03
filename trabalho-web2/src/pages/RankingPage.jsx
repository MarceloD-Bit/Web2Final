import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Trophy, Clock, Target, Zap, Filter, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/GameContext';
import AudioControls from '@/components/AudioControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RankingPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games, getGameRanking } = useGame();
  const [sortBy, setSortBy] = useState('score');

  const game = games.find(g => g.id === gameId);
  const allResults = getGameRanking(gameId);

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

  const sortedResults = [...allResults].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'time':
        return a.timeElapsed - b.timeElapsed;
      case 'streak':
        return b.maxStreak - a.maxStreak;
      default:
        return b.score - a.score;
    }
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-primary" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const sortOptions = [
    { value: 'score', label: 'Pontuação', icon: Trophy },
    { value: 'accuracy', label: 'Precisão', icon: Target },
    { value: 'time', label: 'Tempo', icon: Clock },
    { value: 'streak', label: 'Sequência', icon: Zap }
  ];

  return (
    <>
      <Helmet>
        <title>Ranking - {game.title} - EduGames</title>
        <meta name="description" content={`Veja o ranking dos melhores jogadores em ${game.title}`} />
      </Helmet>

      <div className="min-h-screen p-4">
        <AudioControls />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/library')}
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Ranking</h1>
                <p className="text-muted-foreground">{game.title}</p>
              </div>
            </div>
            <Button onClick={() => navigate(`/play/${game.id}`)}>
              Jogar Agora
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ordenar por:</h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {sortedResults.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Ranking Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between p-4 rounded-lg bg-secondary`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <div className="font-medium text-lg">{result.playerName}</div>
                          <div className="text-muted-foreground text-sm">
                            {new Date(result.timestamp).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-primary">{result.score}</div>
                          <div className="text-muted-foreground text-xs">Pontos</div>
                        </div>
                        <div>
                          <div className="font-bold">{result.accuracy}%</div>
                          <div className="text-muted-foreground text-xs">Precisão</div>
                        </div>
                        <div>
                          <div className="font-bold">{formatTime(result.timeElapsed)}</div>
                          <div className="text-muted-foreground text-xs">Tempo</div>
                        </div>
                        <div>
                          <div className="font-bold">{result.maxStreak}</div>
                          <div className="text-muted-foreground text-xs">Sequência</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum resultado ainda</h3>
              <p className="mt-1 text-sm text-muted-foreground">Seja o primeiro a jogar e aparecer no ranking!</p>
              <Button
                onClick={() => navigate(`/play/${game.id}`)}
                className="mt-6"
              >
                Jogar Agora
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RankingPage;