import { Input, Select, SelectItem, Button } from '@heroui/react';
import { SearchIcon, RefreshCwIcon } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search projects..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />

        <Select
          className="w-full sm:max-w-[200px]"
          label="Status"
          placeholder="Filter by status"
          selectedKeys={new Set(selectedStatus)}
          selectionMode="multiple"
          onSelectionChange={keys => {
            const selected = Array.from(keys) as string[];
            onStatusChange(selected);
          }}
        >
          {statusOptions.map(status => (
            <SelectItem key={status.key}>{status.label}</SelectItem>
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
