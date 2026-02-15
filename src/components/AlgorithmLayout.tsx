import { useState } from 'react';
import { algorithms } from '@/data/algorithms';
import AlgorithmSelector from './AlgorithmSelector';
import LinearSearchViz from './LinearSearchViz';
import { Separator } from './ui/separator';

export default function AlgorithmLayout() {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('linear-search');

  const selectedAlgorithm = algorithms.find(
    (algo) => algo.id === selectedAlgorithmId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">Algorithm Visual Guide</h1>
            <p className="text-sm text-gray-600">Interactive visualizations of search and sorting algorithms</p>
          </div>
          <AlgorithmSelector
            algorithms={algorithms}
            selectedId={selectedAlgorithmId}
            onSelect={setSelectedAlgorithmId}
          />
        </header>

        <Separator className="mb-4" />

        {/* Algorithm Visualization */}
        {selectedAlgorithm && (
          <div>
            {selectedAlgorithm.id === 'linear-search' && (
              <LinearSearchViz algorithm={selectedAlgorithm} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
