import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { algorithms } from '@/data/algorithms';
import { getVizComponent } from '@/registry/algorithmVizRegistry';
import AlgorithmSelector from './AlgorithmSelector';
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

  const VizComponent = getVizComponent(algorithmId ?? undefined);

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
              selectedValue={selectedValue}
              onSelect={handleSelect}
            />
            <ThemeSwitch />
          </div>
        </header>

        <Separator className="mb-4 dark:bg-gray-600" />

        {isHome ? (
          <HomePage />
        ) : VizComponent && selectedAlgorithm ? (
          <div>
            <VizComponent algorithm={selectedAlgorithm} />
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
