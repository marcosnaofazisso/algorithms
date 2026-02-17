import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { algorithmsByCategory } from '@/data/algorithms';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AlgorithmSelectorProps {
  selectedValue: string; // 'home' or algorithm id
  onSelect: (value: string) => void;
}

export default function AlgorithmSelector({
  selectedValue,
  onSelect,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-500 dark:bg-[#0f1117] dark:text-gray-300 dark:hover:bg-[#1a1d24] dark:focus:ring-offset-gray-900"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      <Select
        value={selectedValue || 'home'}
        onValueChange={onSelect}
      >
        <SelectTrigger className="w-[160px] h-9 p-2 text-sm">
          <SelectValue placeholder="Home" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="home">Home</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Search</SelectLabel>
            {algorithmsByCategory.search.map((algo) => (
              <SelectItem key={algo.id} value={algo.id}>
                {algo.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            {algorithmsByCategory.sorting.map((algo) => (
              <SelectItem key={algo.id} value={algo.id}>
                {algo.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Trees</SelectLabel>
            {algorithmsByCategory.trees.map((algo) => (
              <SelectItem key={algo.id} value={algo.id}>
                {algo.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
