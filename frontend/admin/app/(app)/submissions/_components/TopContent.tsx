'use client';

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
import { SearchIcon, RefreshCwIcon, MoreVerticalIcon, FilterIcon, ChevronDownIcon, XIcon } from 'lucide-react';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedPrivacy: string[];
  onPrivacyChange: (privacy: string[]) => void;
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
  onRefresh: () => void;
};

export default function TopContent({
  filterValue,
  onClear,
  onSearchChange,
  selectedPrivacy,
  onPrivacyChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
}: TopContentProps) {
  const privacyOptions = [
    { key: 'PUBLIC', label: 'Public' },
    { key: 'PRIVATE', label: 'Private' },
    { key: 'ANONYMOUS', label: 'Anonymous' },
    { key: 'CONFIDENTIAL', label: 'Confidential' },
  ];

  const statusOptions = [
    { key: 'pending', label: 'Pending' },
    { key: 'analyzed', label: 'Analyzed' },
    { key: 'archived', label: 'Archived' },
  ];

  const hasActiveFilters = filterValue || selectedPrivacy.length > 0 || selectedStatus.length > 0;

  const clearAllFilters = () => {
    onClear();
    onPrivacyChange([]);
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
            placeholder="Search submissions by ID, feedback, or submitter..."
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
          {/* Privacy Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  selectedPrivacy.length > 0 
                    ? 'bg-primary-100 text-primary-700 border-primary-300' 
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Privacy
                {selectedPrivacy.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                    {selectedPrivacy.length}
                  </span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Privacy filter"
              selectionMode="multiple"
              selectedKeys={selectedPrivacy}
              onSelectionChange={(keys) => onPrivacyChange(Array.from(keys) as string[])}
              className="w-64"
            >
              {privacyOptions.map((privacy) => (
                <DropdownItem key={privacy.key} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🔒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{privacy.label}</div>
                      <div className="text-xs text-default-500">Privacy level</div>
                    </div>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  selectedStatus.length > 0 
                    ? 'bg-secondary-100 text-secondary-700 border-secondary-300' 
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Status
                {selectedStatus.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-secondary-500 text-white text-xs rounded-full">
                    {selectedStatus.length}
                  </span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status filter"
              selectionMode="multiple"
              selectedKeys={selectedStatus}
              onSelectionChange={(keys) => onStatusChange(Array.from(keys) as string[])}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.key} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                      status.key === 'analyzed' ? 'from-green-50 to-emerald-50' :
                      status.key === 'pending' ? 'from-orange-50 to-yellow-50' :
                      'from-gray-50 to-slate-50'
                    } flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">
                        {status.key === 'analyzed' ? '✅' : 
                         status.key === 'pending' ? '⏳' : '📁'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{status.label}</div>
                      <div className="text-xs text-default-500">Analysis status</div>
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
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              Search: "{filterValue}"
            </span>
          )}
          
          {selectedPrivacy.map((privacy) => {
            const privacyInfo = privacyOptions.find(p => p.key === privacy);
            return (
              <span
                key={privacy}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                Privacy: {privacyInfo?.label || privacy}
              </span>
            );
          })}
          
          {selectedStatus.map((status) => {
            const statusInfo = statusOptions.find(s => s.key === status);
            return (
              <span
                key={status}
                className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
              >
                Status: {statusInfo?.label || status}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
