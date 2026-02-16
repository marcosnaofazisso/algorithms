import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select } from './ui/select';

interface CodeSnippetProps {
  code: string;
  language?: string;
}

const LANGUAGES = [{ id: 'python', label: 'Python' }] as const;

export default function CodeSnippet({ code, language = 'python' }: CodeSnippetProps) {
  const [selectedLang, setSelectedLang] = useState<string>(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="code-container">
      <CardHeader className="code-header py-2 px-4 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Code</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-28 h-8 text-xs"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </Select>
          <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 text-xs cursor-pointer">
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="code-content px-4 pb-4 pt-0">
        <pre className="overflow-x-auto bg-gray-50 dark:bg-[#0a0c10] border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-xs text-gray-900 dark:text-gray-50">
          <code
            className="font-mono"
            style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
          >
            {code}
          </code>
        </pre>
      </CardContent>
    </Card>
  );
}
