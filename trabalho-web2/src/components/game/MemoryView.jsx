import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MemoryView = ({ data, allData, gameState, onAnswer }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Encontre o par correto</CardTitle>
        <CardDescription className="text-4xl font-bold text-primary pt-4">{data.term}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allData.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              onClick={() => onAnswer(item.definition, item.definition === data.definition)}
              disabled={gameState.showResult}
              className={`h-auto p-4 text-lg whitespace-normal ${
                gameState.showResult
                  ? item.definition === data.definition
                    ? 'correct-answer'
                    : item.definition === gameState.selectedAnswer
                    ? 'incorrect-answer'
                    : 'border-input'
                  : 'hover:bg-accent'
              }`}
            >
              {item.definition}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryView;