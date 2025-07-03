import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { useToast } from '@/components/ui/use-toast';

export const useGameLogic = (gameId) => {
  const navigate = useNavigate();
  const { games, saveGameResult } = useGame();
  const { playCorrectSound, playIncorrectSound, playStreakSound, playVictorySound } = useAudio();
  const { toast } = useToast();

  const game = games.find(g => g.id === gameId);

  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    maxStreak: 0,
    timeElapsed: 0,
    isGameActive: false,
    isGameFinished: false,
    selectedAnswer: null,
    showResult: false,
    gameData: []
  });

  useEffect(() => {
    if (!game) {
      navigate('/library');
      return;
    }
    initializeGame();
  }, [game, gameId]);

  useEffect(() => {
    let timer;
    if (gameState.isGameActive && !gameState.isGameFinished) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isGameActive, gameState.isGameFinished]);

  const initializeGame = () => {
    if (!game) return;

    let preparedData = [];
    switch (game.type) {
      case 'memory':
        preparedData = [...game.data].sort(() => 0.5 - Math.random());
        break;
      case 'quiz':
        preparedData = game.data.map(item => {
          const correctAnswer = item.definition;
          const wrongAnswers = game.data
            .filter(d => d.definition !== correctAnswer)
            .map(d => d.definition)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
          return { question: item.term, correctAnswer, options };
        }).sort(() => 0.5 - Math.random());
        break;
      case 'dragdrop':
      case 'classification':
        preparedData = Object.entries(game.data).flatMap(([category, items]) =>
          items.map(item => ({ item, correctCategory: category }))
        ).sort(() => 0.5 - Math.random());
        break;
      case 'sequence':
        preparedData = [...game.data].sort(() => 0.5 - Math.random());
        break;
      default:
        preparedData = [];
    }

    setGameState({
      currentQuestion: 0,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      streak: 0,
      maxStreak: 0,
      timeElapsed: 0,
      isGameActive: true,
      isGameFinished: false,
      selectedAnswer: null,
      showResult: false,
      gameData: preparedData
    });
  };

  const finishGame = (isCorrect) => {
    playVictorySound();
    
    const updatedCorrect = gameState.correctAnswers + (isCorrect ? 1 : 0);
    const updatedIncorrect = gameState.incorrectAnswers + (isCorrect ? 0 : 1);
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const finalScore = gameState.score + (isCorrect ? (newStreak >= 3 ? 150 : 100) : 0);

    const result = {
      gameId: game.id,
      gameTitle: game.title,
      score: finalScore,
      correctAnswers: updatedCorrect,
      incorrectAnswers: updatedIncorrect,
      timeElapsed: gameState.timeElapsed,
      maxStreak: Math.max(gameState.maxStreak, newStreak),
      accuracy: Math.round((updatedCorrect / gameState.gameData.length) * 100)
    };

    saveGameResult(result);
    
    setGameState(prev => ({
      ...prev,
      isGameActive: false,
      isGameFinished: true,
      score: result.score,
      correctAnswers: result.correctAnswers,
      maxStreak: result.maxStreak
    }));
  };

  const handleAnswer = (selected, isCorrect) => {
    if (gameState.showResult) return;

    setGameState(prev => ({ ...prev, selectedAnswer: selected, showResult: true }));

    setTimeout(() => {
      if (isCorrect) {
        playCorrectSound();
        const newStreak = gameState.streak + 1;
        if (newStreak >= 3) {
          playStreakSound();
          toast({
            title: "Sequência de acertos!",
            description: `${newStreak} acertos consecutivos! Bônus de pontuação!`,
          });
        }
        setGameState(prev => ({
          ...prev,
          score: prev.score + (newStreak >= 3 ? 150 : 100),
          correctAnswers: prev.correctAnswers + 1,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak)
        }));
      } else {
        playIncorrectSound();
        setGameState(prev => ({
          ...prev,
          incorrectAnswers: prev.incorrectAnswers + 1,
          streak: 0
        }));
      }

      if (gameState.currentQuestion + 1 >= gameState.gameData.length) {
        setTimeout(() => finishGame(isCorrect), 1000);
      } else {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
            selectedAnswer: null,
            showResult: false
          }));
        }, 1500);
      }
    }, 1000);
  };

  return { game, gameState, initializeGame, handleAnswer };
};