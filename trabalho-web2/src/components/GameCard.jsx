import React from 'react';
import { Play, Edit, Trash2, Share2, Trophy, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const GameCard = ({ game, onPlay, onEdit, onDelete, showActions = true }) => {
  const { toast } = useToast();

  const getGameTypeName = (type) => {
    const names = {
      memory: 'Jogo da Memória',
      quiz: 'Quiz',
      dragdrop: 'Arrastar e Soltar',
      classification: 'Classificação',
      sequence: 'Ordem Correta'
    };
    return names[type] || 'Jogo';
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/play/${game.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: `Código: ${game.shareCode} | Link copiado para a área de transferência`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Puzzle className="w-8 h-8 text-primary" />
            <div>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{getGameTypeName(game.type)}</CardDescription>
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {game.shareCode}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2 h-10">{game.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {game.type === 'memory' || game.type === 'quiz' || game.type === 'sequence' 
              ? `${game.data.length} termos` 
              : `${Object.keys(game.data).length} categorias`}
          </span>
          <span className="flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>Melhor: 0</span>
          </span>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex space-x-2">
          <Button
            onClick={() => onPlay(game)}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Jogar
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size="icon"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onEdit(game)}
            variant="outline"
            size="icon"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(game.id)}
            variant="destructive"
            size="icon"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GameCard;