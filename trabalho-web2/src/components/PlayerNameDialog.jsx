import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

const PlayerNameDialog = ({ open, onClose, onSave, currentName = '' }) => {
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Identificação do Jogador</span>
          </DialogTitle>
          <DialogDescription>
            Digite seu nome para começar a jogar e aparecer no ranking!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          <Label htmlFor="playerName">Nome do Jogador</Label>
          <Input
            id="playerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome..."
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Nome
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNameDialog;