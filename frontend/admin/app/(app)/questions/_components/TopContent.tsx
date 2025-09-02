import { Input, Select, SelectItem, Button } from '@heroui/react';
import { SearchIcon, RefreshCwIcon } from 'lucide-react';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedType?: string[];
  onTypeChange: (type: string[]) => void;
  selectedCategory?: string[];
  onCategoryChange: (category: string[]) => void;
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
    { key: 'TEXT', label: 'Text Based' },
    { key: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { key: 'RATING', label: 'Rating' },
    { key: 'BOOLEAN', label: 'Boolean' },
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
            const selected = Array.from(keys) as string[];
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
            const selected = Array.from(keys) as string[];
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
