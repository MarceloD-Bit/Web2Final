import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClassificationView = ({ data, categories, gameState, onAnswer }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Classifique o item</CardTitle>
        <CardDescription className="text-3xl font-bold text-primary pt-4">{data.item}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="lg"
              onClick={() => onAnswer(category, category === data.correctCategory)}
              disabled={gameState.showResult}
              className={`h-auto p-6 text-lg whitespace-normal ${
                gameState.showResult
                  ? category === data.correctCategory
                    ? 'correct-answer'
                    : category === gameState.selectedAnswer
                    ? 'incorrect-answer'
                    : 'border-input'
                  : 'hover:bg-accent'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassificationView;