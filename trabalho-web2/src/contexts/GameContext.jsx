
import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de um GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [playerName, setPlayerName] = useState('');

  
  useEffect(() => {
    const savedGames = localStorage.getItem('eduGames');
    const savedResults = localStorage.getItem('eduGameResults');
    const savedPlayerName = localStorage.getItem('eduPlayerName');

    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
    if (savedResults) {
      setGameResults(JSON.parse(savedResults));
    }
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  
  const saveGame = (game) => {
    const gameWithId = {
      ...game,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      shareCode: generateShareCode()
    };
    
    const updatedGames = [...games, gameWithId];
    setGames(updatedGames);
    localStorage.setItem('eduGames', JSON.stringify(updatedGames));
    return gameWithId;
  };

  
  const updateGame = (gameId, updatedGame) => {
    const updatedGames = games.map(game => 
      game.id === gameId ? { ...game, ...updatedGame } : game
    );
    setGames(updatedGames);
    localStorage.setItem('eduGames', JSON.stringify(updatedGames));
  };

  
  const deleteGame = (gameId) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    setGames(updatedGames);
    localStorage.setItem('eduGames', JSON.stringify(updatedGames));
  };

  const saveGameResult = (result) => {
    const resultWithId = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      playerName: playerName || 'Jogador Anônimo'
    };
    
    const updatedResults = [...gameResults, resultWithId];
    setGameResults(updatedResults);
    localStorage.setItem('eduGameResults', JSON.stringify(updatedResults));
    return resultWithId;
  };

  
  const savePlayerName = (name) => {
    setPlayerName(name);
    localStorage.setItem('eduPlayerName', name);
  };


  const generateShareCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  
  const findGameByCode = (code) => {
    return games.find(game => game.shareCode === code.toUpperCase());
  };

  
  const getGameRanking = (gameId) => {
    return gameResults
      .filter(result => result.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const value = {
    games,
    currentGame,
    setCurrentGame,
    gameResults,
    playerName,
    saveGame,
    updateGame,
    deleteGame,
    saveGameResult,
    savePlayerName,
    findGameByCode,
    getGameRanking
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
