import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { algorithms } from '@/data/algorithms';
import AlgorithmSelector from './AlgorithmSelector';
import LinearSearchViz from './LinearSearchViz';
import BinarySearchViz from './BinarySearchViz';
import InsertionSortViz from './InsertionSortViz';
import MergeSortViz from './MergeSortViz';
import BubbleSortViz from './BubbleSortViz';
import QuickSortViz from './QuickSortViz';
import SelectionSortViz from './SelectionSortViz';
import HeapSortViz from './HeapSortViz';
import CountingSortViz from './CountingSortViz';
import RadixSortViz from './RadixSortViz';
import BucketSortViz from './BucketSortViz';
import HomePage from './HomePage';
import { ThemeSwitch } from './ThemeSwitch';
import { Separator } from './ui/separator';

export default function AlgorithmLayout() {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/home';
  const selectedValue = isHome ? 'home' : (algorithmId ?? 'home');
  const selectedAlgorithm = algorithmId
    ? algorithms.find((algo) => algo.id === algorithmId)
    : null;

  const handleSelect = (value: string) => {
    if (value === 'home') {
      navigate('/');
      return;
    }
    navigate(`/${value}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-[#0a0c10] dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-900 dark:text-white hover:cursor-pointer" onClick={() => navigate('/')}>
              Algorithm
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Interactive visualizations of search and sorting algorithms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AlgorithmSelector
              algorithms={algorithms}
              selectedValue={selectedValue}
              onSelect={handleSelect}
            />
            <ThemeSwitch />
          </div>
        </header>

        <Separator className="mb-4 dark:bg-gray-600" />

        {isHome ? (
          <HomePage />
        ) : selectedAlgorithm ? (
          <div>
            {selectedAlgorithm.id === 'linear-search' && (
              <LinearSearchViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'binary-search' && (
              <BinarySearchViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'insertion-sort' && (
              <InsertionSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'merge-sort' && (
              <MergeSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'bubble-sort' && (
              <BubbleSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'quick-sort' && (
              <QuickSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'selection-sort' && (
              <SelectionSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'heap-sort' && (
              <HeapSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'counting-sort' && (
              <CountingSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'radix-sort' && (
              <RadixSortViz algorithm={selectedAlgorithm} />
            )}
            {selectedAlgorithm.id === 'bucket-sort' && (
              <BucketSortViz algorithm={selectedAlgorithm} />
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-600 dark:text-gray-300">
            Algorithm not found. <Link to="/" className="underline">Go home</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
