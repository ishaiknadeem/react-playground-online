
import React, { useId } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ARIA_LABELS } from '@/utils/accessibility';
import { useDebounce } from '@/hooks/usePerformance';

interface ExamSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ExamSearch: React.FC<ExamSearchProps> = React.memo(({ searchTerm, onSearchChange }) => {
  const searchId = useId();
  const debouncedSearch = useDebounce(onSearchChange, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
            aria-hidden="true"
          />
          <Input
            id={searchId}
            placeholder="Search my exams..."
            defaultValue={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label={ARIA_LABELS.dashboard.searchExams}
            role="searchbox"
            aria-describedby={`${searchId}-description`}
          />
          <div id={`${searchId}-description`} className="sr-only">
            Search through your exams by title, description, or status
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ExamSearch.displayName = 'ExamSearch';

export default ExamSearch;
