import { Algorithm } from '@/types/algorithms';
import { Select } from '@/components/ui/select';

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AlgorithmSelector({
  algorithms,
  selectedId,
  onSelect,
}: AlgorithmSelectorProps) {
  return (
    <Select
      value={selectedId}
      onChange={(e) => onSelect(e.target.value)}
      className="w-[180px] h-9 text-sm"
    >
      <option value="">Choose an algorithm...</option>
      {algorithms.map((algo) => (
        <option key={algo.id} value={algo.id}>
          {algo.name}
        </option>
      ))}
    </Select>
  );
}
