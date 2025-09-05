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
  FileTextIcon,
  ListIcon,
  StarIcon,
  ToggleLeftIcon,
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
    { 
      key: 'TEXT', 
      label: 'Text Input', 
      icon: FileTextIcon, 
      color: 'default',
      description: 'Free text response',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
    },
    { 
      key: 'MULTIPLE_CHOICE', 
      label: 'Multiple Choice', 
      icon: ListIcon, 
      color: 'primary',
      description: 'Select from options',
      bgColor: 'from-purple-50 to-violet-50',
      textColor: 'text-purple-700',
    },
    { 
      key: 'RATING', 
      label: 'Rating Scale', 
      icon: StarIcon, 
      color: 'warning',
      description: 'Numeric rating',
      bgColor: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
    },
    { 
      key: 'BOOLEAN', 
      label: 'Yes/No', 
      icon: ToggleLeftIcon, 
      color: 'success',
      description: 'Boolean choice',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
    },
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
              aria-label="Question types"
              selectionMode="multiple"
              selectedKeys={selectedType}
              onSelectionChange={handleTypeSelection}
              className="w-64"
            >
              {questionTypes.map((type) => (
                <DropdownItem key={type.key} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <type.icon className={`w-4 h-4 ${type.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{type.label}</div>
                      <div className="text-xs text-default-500">{type.description}</div>
                    </div>
                  </div>
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
              aria-label="Question categories"
              selectionMode="multiple"
              selectedKeys={selectedCategory}
              onSelectionChange={handleCategorySelection}
            >
              <DropdownItem key="general">General</DropdownItem>
              <DropdownItem key="feedback">Feedback</DropdownItem>
              <DropdownItem key="satisfaction">Satisfaction</DropdownItem>
              <DropdownItem key="performance">Performance</DropdownItem>
              <DropdownItem key="workplace">Workplace</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="flat"
              color="default"
              startContent={<XIcon className="w-4 h-4" />}
              onPress={clearAllFilters}
              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
            >
              Clear All
            </Button>
          )}

          {/* Refresh Button */}
          <Button
            variant="flat"
            color="primary"
            startContent={<RefreshCwIcon className="w-4 h-4" />}
            onPress={onRefresh}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-default-600">Active filters:</span>
          
          {filterValue && (
            <Chip
              variant="flat"
              color="primary"
              onClose={() => onSearchChange('')}
              className="bg-blue-100 text-blue-700"
            >
              Search: "{filterValue}"
            </Chip>
          )}
          
          {selectedType.map((type) => {
            const typeInfo = questionTypes.find(t => t.key === type);
            return (
              <Chip
                key={type}
                variant="flat"
                color="primary"
                onClose={() => onTypeChange(selectedType.filter(t => t !== type))}
                className="bg-purple-100 text-purple-700"
              >
                Type: {typeInfo?.label || type}
              </Chip>
            );
          })}
          
          {selectedCategory.map((category) => (
            <Chip
              key={category}
              variant="flat"
              color="secondary"
              onClose={() => onCategoryChange(selectedCategory.filter(c => c !== category))}
              className="bg-orange-100 text-orange-700"
            >
              Category: {category}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
