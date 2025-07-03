import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Search, Filter, Plus, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';
import GameCard from '@/components/GameCard';
import PlayerNameDialog from '@/components/PlayerNameDialog';
import AudioControls from '@/components/AudioControls';
import { Card, CardContent } from '@/components/ui/card';

const GameLibraryPage = () => {
  const navigate = useNavigate();
  const { deleteGame, playerName, savePlayerName } = useGame();
  const { toast } = useToast();

  const [games, setGames] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingGame, setPendingGame] = useState(null);

  const gameTypes = [
    { value: 'all', label: 'Todos os Jogos' },
    { value: 'memory', label: 'Jogo da Memória' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'dragdrop', label: 'Arrastar e Soltar' },
    { value: 'classification', label: 'Classificação' },
    { value: 'sequence', label: 'Ordem Correta' }
  ];

  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games'); 
        const data = await response.json();
        if (response.ok) {
          setGames(data);
        } else {
          toast({
            title: 'Erro ao buscar jogos',
            description: data?.error || 'Erro desconhecido',
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Erro de conexão',
          description: 'Não foi possível conectar ao servidor',
          variant: 'destructive'
        });
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter(game => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || game.type === filterType;
    return matchesSearch && matchesType;
  });

  const handlePlayGame = (game) => {
    if (!playerName) {
      setPendingGame(game);
      setShowNameDialog(true);
    } else {
      navigate(`/play/${game.id}`);
    }
  };

  const handleEditGame = (game) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Edição de jogos estará disponível em breve!",
    });
  };

  const handleDeleteGame = (gameId) => {
    deleteGame(gameId);
    toast({
      title: "Jogo excluído",
      description: "O jogo foi removido com sucesso",
    });
    setGames(prev => prev.filter(g => g.id !== gameId));
  };

  const handleSavePlayerName = (name) => {
    savePlayerName(name);
    if (pendingGame) {
      navigate(`/play/${pendingGame.id}`);
      setPendingGame(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Biblioteca de Jogos - EduGames</title>
        <meta name="description" content="Explore todos os jogos educativos disponíveis" />
      </Helmet>

      <div className="min-h-screen p-4">
        <AudioControls />

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/')} variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Biblioteca de Jogos</h1>
                <p className="text-muted-foreground">Explore e jogue todos os jogos disponíveis</p>
              </div>
            </div>
            <Button onClick={() => navigate('/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Jogo
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar jogos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handlePlayGame}
                  onEdit={handleEditGame}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Puzzle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {games.length === 0 ? 'Nenhum jogo criado ainda' : 'Nenhum jogo encontrado'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {games.length === 0 
                  ? 'Crie seu primeiro jogo educativo!' 
                  : 'Tente ajustar os filtros de busca'}
              </p>
              {games.length === 0 && (
                <Button onClick={() => navigate('/create')} className="mt-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Jogo
                </Button>
              )}
            </div>
          )}

          {games.length > 0 && (
            <Card className="mt-8">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{games.length}</div>
                    <div className="text-muted-foreground text-sm">Total de Jogos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {games.filter(g => g.type === 'memory').length}
                    </div>
                    <div className="text-muted-foreground text-sm">Jogos da Memória</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {games.filter(g => g.type === 'quiz').length}
                    </div>
                    <div className="text-muted-foreground text-sm">Quiz</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {games.filter(g => ['dragdrop', 'classification', 'sequence'].includes(g.type)).length}
                    </div>
                    <div className="text-muted-foreground text-sm">Outros</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <PlayerNameDialog
          open={showNameDialog}
          onClose={() => setShowNameDialog(false)}
          onSave={handleSavePlayerName}
          currentName={playerName}
        />
      </div>
    </>
  );
};

export default GameLibraryPage;
