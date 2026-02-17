import { useState } from 'react';
import { toast } from 'sonner';
import type { CodeLanguageId } from '@/types/algorithms';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { NativeSelect } from './ui/native-select';

interface CodeSnippetProps {
  codeByLanguage: Record<CodeLanguageId, string>;
  defaultLanguage?: CodeLanguageId;
}

const LANGUAGES: { id: CodeLanguageId; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
  { id: 'php', label: 'PHP' },
  { id: 'node', label: 'Node' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
];

const FALLBACK_MESSAGE = 'Code not available for this language.';

export default function CodeSnippet({ codeByLanguage, defaultLanguage = 'python' }: CodeSnippetProps) {
  const [selectedLang, setSelectedLang] = useState<CodeLanguageId>(defaultLanguage);

  const code = codeByLanguage[selectedLang] ?? FALLBACK_MESSAGE;

  const handleCopy = async () => {
    const toCopy = codeByLanguage[selectedLang];
    if (!toCopy) return;
    try {
      await navigator.clipboard.writeText(toCopy);
      toast.success('Code copied!', {
        style: { background: '#fff', color: '#000', border: '1px solid #e5e5e5' },
      });
    } catch {
      toast.error('Failed to copy', {
        style: { background: '#fff', color: '#000', border: '1px solid #e5e5e5' },
      });
    }
  };

  return (
    <Card className="code-container">
      <CardHeader className="code-header py-2 px-4 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Code</CardTitle>
        <div className="flex items-center gap-2">
          <NativeSelect
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as CodeLanguageId)}
            className="w-28 h-8 text-xs"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </NativeSelect>
          <Button size="sm" variant="outline" onClick={handleCopy} disabled={!codeByLanguage[selectedLang]} className="h-8 text-xs cursor-pointer">
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
