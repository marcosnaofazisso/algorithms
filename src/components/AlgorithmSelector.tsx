import { Select } from '@/components/ui/select';
import { Algorithm } from '@/types/algorithms';

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AlgorithmSelector({ 
  algorithms, 
  selectedId, 
  onSelect 
}: AlgorithmSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">
        Select Algorithm
      </label>
      <Select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full"
      >
        <option value="">Choose an algorithm...</option>
        {algorithms.map((algo) => (
          <option key={algo.id} value={algo.id}>
            {algo.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
