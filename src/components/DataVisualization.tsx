import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VisualizationState } from '@/types/algorithms';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MagicCard } from './ui/magic-card';

interface DataVisualizationProps {
  state: VisualizationState;
  /** Duration in ms of the last run (when complete). Shown next to success message. */
  lastRunDurationMs?: number | null;
}

export default function DataVisualization({ state, lastRunDurationMs }: DataVisualizationProps) {
  const { data, currentIndex, targetValue, found, isComplete } = state;
  const foundCellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (found && currentIndex >= 0 && foundCellRef.current) {
      const rect = foundCellRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 24,
        spread: 50,
        origin: { x, y },
        startVelocity: 18,
        decay: 0.9,
        scalar: 0.8,
      });
    }
  }, [found, currentIndex]);

  const getBoxStyle = (index: number) => {
    if (found && index === currentIndex) {
      return 'border-2 border-black bg-black text-white shadow-lg animate-pulse';
    }
    if (index === currentIndex && !isComplete) {
      return 'border-2 border-black bg-black text-white shadow-md scale-105';
    }
    return 'border border-gray-300 bg-white text-black shadow-sm';
  };

  return (
    <Card>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-base">Array Visualization</CardTitle>
        {targetValue !== null && (
          <p className="text-xs mt-1 text-gray-600">
            Searching for: <span className="font-bold text-black">{targetValue}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[70px]">
          {data.map((value, index) => (
            <MagicCard
              key={index}
              className="shrink-0"
              gradientSize={80}
              gradientOpacity={0.15}
              gradientColor="rgba(0,0,0,0.08)"
            >
              <div
                ref={found && index === currentIndex ? foundCellRef : undefined}
                className={`
                  w-12 h-12 flex items-center justify-center text-base font-semibold rounded-lg transition-all duration-300
                  ${getBoxStyle(index)}
                `}
              >
                {value}
              </div>
            </MagicCard>
          ))}
        </div>
        <div className="mt-3 text-center text-xs">
          {!isComplete && currentIndex >= 0 && (
            <p>Checking index {currentIndex}: arr[{currentIndex}] = {data[currentIndex]}</p>
          )}
          {isComplete && found && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg inline-block border border-green-200">
                <p className="font-bold">✓ Element {targetValue} found at index {currentIndex}!</p>
              </div>
              {lastRunDurationMs != null && (
                <div className="text-gray-600 text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 inline-block">
                  Duration: {(lastRunDurationMs / 1000).toFixed(1)} seconds ({lastRunDurationMs}ms)
                </div>
              )}
            </div>
          )}
          {isComplete && !found && (
            <p className="font-bold">✗ Element {targetValue} not found in array</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
