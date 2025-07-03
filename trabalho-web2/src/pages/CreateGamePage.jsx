import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AudioControls from '@/components/AudioControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    type: '',
    data: []
  });

  const [currentPair, setCurrentPair] = useState({ term: '', definition: '' });
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [categories, setCategories] = useState({});

  const gameTypes = [
    { value: 'memory', label: 'Jogo da Memória', description: 'Encontrar pares de termos e definições' },
    { value: 'quiz', label: 'Quiz de Associação', description: 'Escolher a definição correta' },
    { value: 'dragdrop', label: 'Arrastar e Soltar', description: 'Arrastar itens para categorias' },
    { value: 'classification', label: 'Classificação', description: 'Classificar itens em categorias' },
    { value: 'sequence', label: 'Ordem Correta', description: 'Ordenar termos na sequência correta' }
  ];

  const isTermDefinitionType = ['memory', 'quiz', 'sequence'].includes(gameData.type);
  const isCategoryType = ['dragdrop', 'classification'].includes(gameData.type);

  const addTermDefinition = () => {
    if (currentPair.term.trim() && currentPair.definition.trim()) {
      setGameData(prev => ({
        ...prev,
        data: [...prev.data, { ...currentPair }]
      }));
      setCurrentPair({ term: '', definition: '' });
    }
  };

  const removeTermDefinition = (index) => {
    setGameData(prev => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index)
    }));
  };

  const addItemToCategory = () => {
    if (currentCategory.trim() && currentItem.trim()) {
      setCategories(prev => ({
        ...prev,
        [currentCategory]: [...(prev[currentCategory] || []), currentItem]
      }));
      setCurrentItem('');
    }
  };

  const removeItemFromCategory = (category, itemIndex) => {
    setCategories(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== itemIndex)
    }));
  };

  const removeCategory = (category) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[category];
      return newCategories;
    });
  };

  const handleSaveGame = async () => {
    if (!gameData.title.trim() || !gameData.type) {
      toast({
        title: "Dados incompletos",
        description: "Preencha o título e selecione o tipo de jogo",
        variant: "destructive"
      });
      return;
    }

    let finalData;
    if (isTermDefinitionType) {
      if (gameData.data.length < 3) {
        toast({
          title: "Dados insuficientes",
          description: "Adicione pelo menos 3 pares de termo/definição",
          variant: "destructive"
        });
        return;
      }
      finalData = gameData.data;
    } else if (isCategoryType) {
      if (Object.keys(categories).length < 2) {
        toast({
          title: "Dados insuficientes",
          description: "Crie pelo menos 2 categorias com itens",
          variant: "destructive"
        });
        return;
      }
      finalData = categories;
    }

    const newGame = {
      ...gameData,
      data: finalData
    };

    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame)
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Jogo criado com sucesso!",
          description: `Código de compartilhamento: ${result.shareCode}`,
        });
        navigate('/library');
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.error || "Tente novamente mais tarde",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao conectar com o servidor",
        description: "Verifique se o backend está rodando",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Criar Jogo - EduGames</title>
        <meta name="description" content="Crie seu próprio jogo educativo personalizado" />
      </Helmet>

      <div className="min-h-screen p-4">
        <AudioControls />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button onClick={() => navigate('/')} variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Criar Novo Jogo</h1>
              <p className="text-muted-foreground">Configure seu jogo educativo personalizado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Título do Jogo</Label>
                  <Input
                    id="title"
                    value={gameData.title}
                    onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do jogo..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={gameData.description}
                    onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva seu jogo..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Jogo</Label>
                  <Select value={gameData.type} onValueChange={(value) => setGameData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o tipo de jogo" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Jogo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isTermDefinitionType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Termo</Label>
                        <Input
                          value={currentPair.term}
                          onChange={(e) => setCurrentPair(prev => ({ ...prev, term: e.target.value }))}
                          placeholder="Digite o termo..."
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Definição</Label>
                        <Input
                          value={currentPair.definition}
                          onChange={(e) => setCurrentPair(prev => ({ ...prev, definition: e.target.value }))}
                          placeholder="Digite a definição..."
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <Button onClick={addTermDefinition} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Par
                    </Button>

                    {gameData.data.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                        {gameData.data.map((pair, index) => (
                          <div key={index} className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                            <div className="flex-1 text-sm">
                              <span className="font-medium">{pair.term}</span>
                              <span className="text-muted-foreground mx-2">→</span>
                              <span className="text-muted-foreground">{pair.definition}</span>
                            </div>
                            <Button onClick={() => removeTermDefinition(index)} variant="destructive" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isCategoryType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={currentCategory}
                          onChange={(e) => setCurrentCategory(e.target.value)}
                          placeholder="Digite a categoria..."
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Item</Label>
                        <Input
                          value={currentItem}
                          onChange={(e) => setCurrentItem(e.target.value)}
                          placeholder="Digite o item..."
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <Button onClick={addItemToCategory} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>

                    {Object.keys(categories).length > 0 && (
                      <div className="space-y-4 max-h-60 overflow-y-auto p-1">
                        {Object.entries(categories).map(([category, items]) => (
                          <div key={category} className="bg-secondary p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold">{category}</h4>
                              <Button onClick={() => removeCategory(category)} variant="destructive" size="icon">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-background p-2 rounded">
                                  <span className="text-muted-foreground">{item}</span>
                                  <Button onClick={() => removeItemFromCategory(category, index)} variant="destructive" size="icon" className="w-6 h-6">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!gameData.type && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Selecione um tipo de jogo para começar a adicionar conteúdo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={handleSaveGame} size="lg">
              <Save className="w-5 h-5 mr-2" />
              Salvar Jogo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGamePage;
