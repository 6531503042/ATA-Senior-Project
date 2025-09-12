import {
  Input,
  Select,
  SelectItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  SearchIcon,
  RefreshCwIcon,
  EllipsisVertical,
  PlusIcon,
} from 'lucide-react';

interface TopContentProps {
  filterValue: string;
  selectedType: string[];
  selectedCategory: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string[]) => void;
  onCategoryChange: (category: string[]) => void;
  onClear: () => void;
  onRefresh: () => void;
  onAdd?: () => void;
  onDeleteSelected?: () => void;
}

export default function TopContent({
  filterValue,
  selectedType,
  selectedCategory,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onClear,
  onRefresh,
  onAdd,
  onDeleteSelected,
}: TopContentProps) {
  const questionTypes = [
    { key: 'TEXT', label: 'Text Input' },
    { key: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { key: 'RATING', label: 'Rating Scale' },
    { key: 'BOOLEAN', label: 'Yes/No' },
  ];

  const categories = [
    { key: 'general', label: 'General' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'satisfaction', label: 'Satisfaction' },
    { key: 'performance', label: 'Performance' },
    { key: 'workplace', label: 'Workplace' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <Input
            isClearable
            className="w-full"
            placeholder="Search questions..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={filterValue}
            variant="bordered"
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="flex items-end gap-3">
          <Select
            className="w-[180px]"
            label="Type"
            placeholder="All types"
            selectedKeys={selectedType.length > 0 ? new Set(selectedType) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as string[];
              onTypeChange(selected);
            }}
          >
            {questionTypes.map(type => (
              <SelectItem key={type.key}>{type.label}</SelectItem>
            ))}
          </Select>

          <Select
            className="w-[180px]"
            label="Category"
            placeholder="All categories"
            selectedKeys={selectedCategory.length > 0 ? new Set(selectedCategory) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as string[];
              onCategoryChange(selected);
            }}
          >
            {categories.map(category => (
              <SelectItem key={category.key}>{category.label}</SelectItem>
            ))}
          </Select>

          <Button
            startContent={<RefreshCwIcon className="w-4 h-4" />}
            variant="bordered"
            onPress={onRefresh}
          >
            Refresh
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <EllipsisVertical className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {onDeleteSelected ? (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={onDeleteSelected}
                >
                  Delete Selected
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>

          {onAdd ? (
            <Button
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={onAdd}
            >
              Add Question
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
