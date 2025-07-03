import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Library, Code, Search, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';
import PlayerNameDialog from '@/components/PlayerNameDialog';
import AudioControls from '@/components/AudioControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const { findGameByCode, playerName, savePlayerName } = useGame();
  const { toast } = useToast();
  const [shareCode, setShareCode] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handlePlayByCode = () => {
    if (!shareCode.trim()) {
      toast({
        title: "Código necessário",
        description: "Digite um código de jogo para continuar",
        variant: "destructive"
      });
      return;
    }

    const game = findGameByCode(shareCode);
    if (!game) {
      toast({
        title: "Jogo não encontrado",
        description: "Código inválido ou jogo não existe",
        variant: "destructive"
      });
      return;
    }

    if (!playerName) {
      setPendingAction(() => () => navigate(`/play/${game.id}`));
      setShowNameDialog(true);
    } else {
      navigate(`/play/${game.id}`);
    }
  };

  const handleSavePlayerName = (name) => {
    savePlayerName(name);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>EduGames - Plataforma de Jogos Educativos</title>
        <meta name="description" content="Crie, compartilhe e jogue jogos educativos interativos. Aprenda de forma divertida!" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AudioControls />
        
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              EduGames
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie, compartilhe e jogue jogos educativos incríveis! 
              Aprenda de forma divertida e interativa.
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Code className="w-6 h-6" />
                <span>Jogar por Código</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite o código do jogo..."
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handlePlayByCode()}
                />
                <Button onClick={handlePlayByCode}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="text-center cursor-pointer hover:border-primary transition-colors" onClick={() => navigate('/create')}>
              <CardHeader>
                <CardTitle>Criar Jogo</CardTitle>
                <CardDescription>
                  Crie seus próprios jogos educativos personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center cursor-pointer hover:border-primary transition-colors" onClick={() => navigate('/library')}>
              <CardHeader>
                <CardTitle>Biblioteca</CardTitle>
                <CardDescription>
                  Explore todos os jogos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  <Library className="w-4 h-4 mr-2" />
                  Explorar
                </Button>
              </CardContent>
            </Card>
          </div>

          {playerName && (
            <div className="max-w-sm mx-auto p-4 rounded-lg bg-card border">
              <p className="text-center text-muted-foreground">
                Bem-vindo, <span className="font-bold text-foreground">{playerName}</span>!
              </p>
            </div>
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

export default HomePage;