import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface TargetComboboxProps {
  options: number[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function TargetCombobox({
  options,
  value,
  onChange,
  disabled,
  placeholder = 'Select or type number',
}: TargetComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueOptions = [...new Set(options)].sort((a, b) => a - b);

  const handleSelect = (num: number) => {
    onChange(String(num));
    setInputValue(String(num));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="h-9 text-sm"
      />
      {open && uniqueOptions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-sm"
          role="listbox"
        >
          {uniqueOptions.map((num) => (
            <li
              key={num}
              role="option"
              aria-selected={value === String(num)}
              className={cn(
                'cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100',
                value === String(num) && 'bg-gray-200 font-medium'
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(num);
              }}
            >
              {num}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
