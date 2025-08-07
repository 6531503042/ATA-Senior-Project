import { Input, Select, SelectItem, Button } from "@heroui/react";
import { SearchIcon, RefreshCwIcon } from "lucide-react";
import { ProjectStatus } from "@/types/project";

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedStatus?: ProjectStatus[];
  onStatusChange: (status: ProjectStatus[]) => void;
  onRefresh: () => void;
};

export default function TopContent({
  filterValue,
  onClear,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
}: TopContentProps) {
  const statusOptions = [
    { key: "pending", label: "Pending" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
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
          label="Status"
          placeholder="Filter by status"
          selectedKeys={selectedStatus ? new Set(selectedStatus) : new Set()}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys) as ProjectStatus[];
            onStatusChange(selected);
          }}
          selectionMode="multiple"
          className="w-full sm:max-w-[200px]"
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.key}>
              {status.label}
            </SelectItem>
          ))}
        </Select>

        <Button
          variant="bordered"
          startContent={<RefreshCwIcon className="w-4 h-4" />}
          onPress={onRefresh}
          className="w-full sm:w-auto"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
