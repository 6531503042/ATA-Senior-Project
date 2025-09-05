import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { SearchIcon, RefreshCwIcon, FilterIcon, ChevronDownIcon, XIcon } from 'lucide-react';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedStatus?: string[];
  onStatusChange: (status: string[]) => void;
  onRefresh: () => void;
};

export default function TopContent({
  filterValue,
  onClear,
  onSearchChange,
  selectedStatus = [],
  onStatusChange,
  onRefresh,
}: TopContentProps) {
  const statusOptions = [
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ];

  const hasActiveFilters = !!filterValue || selectedStatus.length > 0;

  const clearAll = () => {
    onClear();
    onStatusChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            isClearable
            className="w-full"
            placeholder="Search projects by name or description..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              input: 'text-sm',
              inputWrapper: 'h-12 bg-white border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 transition-colors duration-200',
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[160px] ${
                  selectedStatus.length > 0
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Status
                {selectedStatus.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">{selectedStatus.length}</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Project status"
              selectionMode="multiple"
              selectedKeys={selectedStatus}
              onSelectionChange={(keys) => onStatusChange(Array.from(keys) as string[])}
              className="w-56"
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.key} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                      status.key === 'active' ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'
                    } flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{status.key === 'active' ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{status.label}</div>
                      <div className="text-xs text-default-500">Project status</div>
                    </div>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="flat"
              color="default"
              startContent={<XIcon className="w-4 h-4" />}
              onPress={clearAll}
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
    </div>
  );
}
