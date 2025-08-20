import { Input, Select, SelectItem, Button } from '@heroui/react';
import { SearchIcon, RefreshCwIcon } from 'lucide-react';

import { QuestionType, QuestionCategory } from '@/types/question';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedType?: QuestionType[];
  onTypeChange: (type: QuestionType[]) => void;
  selectedCategory?: QuestionCategory[];
  onCategoryChange: (category: QuestionCategory[]) => void;
  onRefresh: () => void;
};

export default function TopContent({
  filterValue,
  onClear,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
}: TopContentProps) {
  const typeOptions = [
    { key: 'single_choice', label: 'Single Choice' },
    { key: 'multiple_choice', label: 'Multiple Choice' },
    { key: 'text_based', label: 'Text Based' },
    { key: 'rating', label: 'Rating' },
    { key: 'boolean', label: 'Boolean' },
  ];

  const categoryOptions = [
    { key: 'project_satisfaction', label: 'Project Satisfaction' },
    { key: 'technical_skills', label: 'Technical Skills' },
    { key: 'communication', label: 'Communication' },
    { key: 'leadership', label: 'Leadership' },
    { key: 'work_environment', label: 'Work Environment' },
    { key: 'work_life_balance', label: 'Work Life Balance' },
    { key: 'team_collaboration', label: 'Team Collaboration' },
    { key: 'general', label: 'General' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search questions..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />

        <Select
          className="w-full sm:max-w-[200px]"
          label="Type"
          placeholder="Filter by type"
          selectedKeys={selectedType ? new Set(selectedType) : new Set()}
          selectionMode="multiple"
          onSelectionChange={keys => {
            const selected = Array.from(keys) as QuestionType[];

            onTypeChange(selected);
          }}
        >
          {typeOptions.map(type => (
            <SelectItem key={type.key}>{type.label}</SelectItem>
          ))}
        </Select>

        <Select
          className="w-full sm:max-w-[200px]"
          label="Category"
          placeholder="Filter by category"
          selectedKeys={
            selectedCategory ? new Set(selectedCategory) : new Set()
          }
          selectionMode="multiple"
          onSelectionChange={keys => {
            const selected = Array.from(keys) as QuestionCategory[];

            onCategoryChange(selected);
          }}
        >
          {categoryOptions.map(category => (
            <SelectItem key={category.key}>{category.label}</SelectItem>
          ))}
        </Select>

        <Button
          className="w-full sm:w-auto"
          startContent={<RefreshCwIcon className="w-4 h-4" />}
          variant="bordered"
          onPress={onRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
