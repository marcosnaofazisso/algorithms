import { Algorithm } from '@/types/algorithms';
import { Select } from '@/components/ui/select';

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedValue: string; // 'home' or algorithm id
  onSelect: (value: string) => void;
}

export default function AlgorithmSelector({
  algorithms,
  selectedValue,
  onSelect,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedValue || 'home'}
        onChange={(e) => onSelect(e.target.value)}
        className="w-[200px] h-9 text-sm"
      >
        <option value="home">Home</option>
        {algorithms.map((algo) => (
          <option key={algo.id} value={algo.id}>
            {algo.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
