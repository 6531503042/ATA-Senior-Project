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
import { useRoles } from '@/hooks/useRoles';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedRole: string[];
  onRoleChange: (role: string[]) => void;
  selectedStatus: boolean[];
  onStatusChange: (status: boolean[]) => void;
  onRefresh: () => void;
  onAdd?: () => void;
  onEditSelected?: () => void;
  onDeleteSelected?: () => void;
};

export default function TopContent({
  filterValue,
  onClear,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
  onAdd,
  onEditSelected,
  onDeleteSelected,
}: TopContentProps) {
  const { roles } = useRoles();
  
  const roleOptions = roles.map(role => ({
    key: role.id,
    label: role.name
  }));

  const statusOptions = [
    { key: true, label: 'Active' },
    { key: false, label: 'Inactive' },
  ];

  const hasActiveFilters = filterValue || selectedRole.length > 0 || selectedStatus.length > 0;

  const clearAllFilters = () => {
    onClear();
    onRoleChange([]);
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
            placeholder="Search users by name, email, or department..."
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
          {/* Role Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  selectedRole.length > 0 
                    ? 'bg-primary-100 text-primary-700 border-primary-300' 
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Role
                {selectedRole.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                    {selectedRole.length}
                  </span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User roles"
              selectionMode="multiple"
              selectedKeys={selectedRole}
              onSelectionChange={(keys) => onRoleChange(Array.from(keys) as string[])}
              className="w-64"
            >
              {roleOptions.map((role) => (
                <DropdownItem key={role.key} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{role.label}</div>
                      <div className="text-xs text-default-500">User role</div>
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
              aria-label="User status"
              selectionMode="multiple"
              selectedKeys={selectedStatus.map(s => s.toString())}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys).map(k => k === 'true') as boolean[];
                onStatusChange(selected);
              }}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.key.toString()} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                      status.key ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'
                    } flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{status.key ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-default-900">{status.label}</div>
                      <div className="text-xs text-default-500">User status</div>
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
          
          {selectedRole.map((role) => {
            const roleInfo = roleOptions.find(r => r.key === role);
            return (
              <span
                key={role}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                Role: {roleInfo?.label || role}
              </span>
            );
          })}
          
          {selectedStatus.map((status) => (
            <span
              key={status.toString()}
              className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
            >
              Status: {status ? 'Active' : 'Inactive'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
