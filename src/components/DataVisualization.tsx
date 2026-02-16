import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VisualizationState } from '@/types/algorithms';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MagicCard } from './ui/magic-card';
import type { Speed } from './LinearSearchViz';

interface DataVisualizationProps {
  state: VisualizationState;
  /** Duration in ms of the last run (when complete). Shown next to success message. */
  lastRunDurationMs?: number | null;
  /** Speed affects transition duration of array cells. */
  speed?: Speed;
}

const SPEED_DURATION_CLASS: Record<Speed, string> = {
  slow: 'duration-500',
  normal: 'duration-300',
  fast: 'duration-150',
};

export default function DataVisualization({ state, lastRunDurationMs, speed = 'normal' }: DataVisualizationProps) {
  const { data, currentIndex, targetValue, found, isComplete, left, right, mid } = state;
  const foundCellRef = useRef<HTMLDivElement | null>(null);
  const transitionClass = SPEED_DURATION_CLASS[speed];
  const isBinarySearch = left !== undefined && right !== undefined;
  const midIndex = mid ?? currentIndex;
  const inRange = (index: number) =>
    isBinarySearch && left !== undefined && right !== undefined && index >= left && index <= right;

  useEffect(() => {
    if (found && midIndex >= 0 && foundCellRef.current) {
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
  }, [found, midIndex]);

  const getBoxStyle = (index: number) => {
    if (found && index === midIndex) {
      return 'border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg animate-pulse';
    }
    if (index === midIndex && !isComplete) {
      return 'border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-md scale-105';
    }
    if (isBinarySearch && inRange(index)) {
      return 'border border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-black dark:text-gray-50 shadow-sm';
    }
    return 'border border-gray-300 dark:border-gray-500 bg-white dark:bg-[#0f1117] text-black dark:text-gray-50 shadow-sm opacity-70';
  };

  return (
    <Card className="output-container">
      <CardHeader className="output-header py-2 px-4">
        <CardTitle className="text-base">Output</CardTitle>
        {targetValue !== null && (
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
            Searching for: <span className="font-bold text-black dark:text-white">{targetValue}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="output-content px-4">
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
                ref={found && index === midIndex ? foundCellRef : undefined}
                className={`
                  w-12 h-12 flex items-center justify-center text-base font-semibold rounded-lg transition-all ${transitionClass}
                  ${getBoxStyle(index)}
                `}
              >
                {value}
              </div>
            </MagicCard>
          ))}
        </div>
        <div className="mt-3 text-center text-xs">
          {isBinarySearch && left !== undefined && right !== undefined && !isComplete && (
            <p className="text-gray-700 dark:text-gray-200">
              left = {left}, right = {right}{mid !== undefined ? `, mid = ${mid}` : ''}
              {mid !== undefined && data[mid] !== undefined && ` → arr[mid] = ${data[mid]}`}
            </p>
          )}
          {!isBinarySearch && !isComplete && currentIndex >= 0 && (
            <p className="text-gray-700 dark:text-gray-200">Checking index {currentIndex}: arr[{currentIndex}] = {data[currentIndex]}</p>
          )}
          {isComplete && found && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-100 px-3 py-2 rounded-lg inline-block border border-green-200 dark:border-green-700">
                <p className="font-bold">✓ Element {targetValue} found at index {midIndex}!</p>
              </div>
              {lastRunDurationMs != null && (
                <div className="text-gray-600 dark:text-gray-300 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-[#0f1117] inline-block">
                  Duration: {(lastRunDurationMs / 1000).toFixed(1)} seconds ({lastRunDurationMs}ms)
                </div>
              )}
            </div>
          )}
          {isComplete && !found && (
            <p className="font-bold text-gray-800 dark:text-gray-100">✗ Element {targetValue} not found in array</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
