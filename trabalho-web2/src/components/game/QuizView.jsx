import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuizView = ({ data, gameState, onAnswer }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-3xl">{data.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              onClick={() => onAnswer(option, option === data.correctAnswer)}
              disabled={gameState.showResult}
              className={`h-auto p-6 text-lg whitespace-normal ${
                gameState.showResult
                  ? option === data.correctAnswer
                    ? 'correct-answer'
                    : option === gameState.selectedAnswer
                    ? 'incorrect-answer'
                    : 'border-input'
                  : 'hover:bg-accent'
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizView;