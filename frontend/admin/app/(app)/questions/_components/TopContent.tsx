import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from '@heroui/react';
import { 
  SearchIcon, 
  FilterIcon, 
  ChevronDownIcon,
  RefreshCwIcon,
  XIcon,
  SettingsIcon,
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
}: TopContentProps) {
  const questionTypes = [
    { key: 'TEXT', label: 'Text Input', icon: '📝', color: 'default' },
    { key: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: '☑️', color: 'primary' },
    { key: 'RATING', label: 'Rating Scale', icon: '⭐', color: 'warning' },
    { key: 'BOOLEAN', label: 'Yes/No', icon: '✅', color: 'success' },
  ];

  const handleTypeSelection = (keys: string[]) => {
    onTypeChange(keys);
  };

  const handleCategorySelection = (keys: string[]) => {
    onCategoryChange(keys);
  };

  const clearAllFilters = () => {
    onClear();
    onTypeChange([]);
    onCategoryChange([]);
  };

  const hasActiveFilters = filterValue || selectedType.length > 0 || selectedCategory.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            isClearable
            className="w-full"
            placeholder="Search questions by text or category..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              input: "text-sm",
              inputWrapper: "h-12 bg-white border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 transition-colors duration-200",
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Type Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  selectedType.length > 0 
                    ? 'bg-primary-100 text-primary-700 border-primary-300' 
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Type
                {selectedType.length > 0 && (
                  <Chip size="sm" variant="flat" color="primary" className="ml-2">
                    {selectedType.length}
                  </Chip>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Question type filter"
              closeOnSelect={false}
              selectedKeys={selectedType}
              selectionMode="multiple"
              onSelectionChange={handleTypeSelection}
              classNames={{
                content: "min-w-[200px]",
              }}
            >
              {questionTypes.map((type) => (
                <DropdownItem key={type.key} className="gap-3">
                  <span className="text-lg" role="img" aria-label={type.label}>
                    {type.icon}
                  </span>
                  <span className="capitalize">{type.label}</span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Category Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  selectedCategory.length > 0 
                    ? 'bg-secondary-100 text-secondary-700 border-secondary-300' 
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Category
                {selectedCategory.length > 0 && (
                  <Chip size="sm" variant="flat" color="secondary" className="ml-2">
                    {selectedCategory.length}
                  </Chip>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Question category filter"
              closeOnSelect={false}
              selectedKeys={selectedCategory}
              selectionMode="multiple"
              onSelectionChange={handleCategorySelection}
              classNames={{
                content: "min-w-[200px]",
              }}
            >
              {['General', 'Technical', 'Feedback', 'Survey', 'Assessment'].map((category) => (
                <DropdownItem key={category} className="capitalize">
                  {category}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Refresh Button */}
          <Button
            color="primary"
            variant="flat"
            startContent={<RefreshCwIcon className="w-4 h-4" />}
            onPress={onRefresh}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Active Filters:</span>
          </div>
          
          {filterValue && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => onClear()}
              className="bg-blue-100 text-blue-700"
            >
              Search: "{filterValue}"
            </Chip>
          )}
          
          {selectedType.map((type) => (
            <Chip
              key={type}
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => onTypeChange(selectedType.filter(t => t !== type))}
              className="bg-primary-100 text-primary-700"
            >
              Type: {type.replace('_', ' ')}
            </Chip>
          ))}
          
          {selectedCategory.map((category) => (
            <Chip
              key={category}
              size="sm"
              variant="flat"
              color="secondary"
              onClose={() => onCategoryChange(selectedCategory.filter(c => c !== category))}
              className="bg-secondary-100 text-secondary-700"
            >
              Category: {category}
            </Chip>
          ))}
          
          <Button
            size="sm"
            variant="light"
            color="danger"
            startContent={<XIcon className="w-4 h-4" />}
            onPress={clearAllFilters}
            className="ml-2"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-default-500">
        <div className="flex items-center gap-4">
          {filterValue && (
            <span>Search results for "{filterValue}"</span>
          )}
          {selectedType.length > 0 && (
            <span>{selectedType.length} type(s) selected</span>
          )}
          {selectedCategory.length > 0 && (
            <span>{selectedCategory.length} category(ies) selected</span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            color="default"
            onPress={clearAllFilters}
            className="text-default-500 hover:text-default-700"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
