import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { algorithms, algorithmsByCategory } from '@/data/algorithms';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CategoryFilter = 'all' | 'search' | 'sorting';

export default function HomePage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlgorithms = useMemo(() => {
    const byCategory =
      categoryFilter === 'all'
        ? algorithms
        : categoryFilter === 'search'
          ? algorithmsByCategory.search
          : algorithmsByCategory.sorting;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((algo) =>
      algo.name.toLowerCase().includes(query)
    );
  }, [categoryFilter, searchQuery]);

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Welcome to Algorithm Visual Guide
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Choose an algorithm from the menu above to explore interactive visualizations,
          or pick one below to get started.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <Input
          type="search"
          placeholder="Search algorithms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
        >
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="search">Search</SelectItem>
            <SelectItem value="sorting">Sort</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlgorithms.map((algo) => (
          <Link
            key={algo.id}
            to={`/${algo.id}`}
            className="block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0f1117] p-4 text-left transition-colors hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-500 dark:hover:bg-[#1a1d24]"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {algo.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {algo.description}
            </p>
            <span className="mt-2 inline-block text-xs text-gray-500 dark:text-gray-400">
              {algo.category} · Worst case {algo.worstCase}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
