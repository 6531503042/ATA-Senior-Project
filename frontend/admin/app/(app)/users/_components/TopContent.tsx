import { Input, Select, SelectItem, Button } from "@heroui/react";
import { SearchIcon, RefreshCwIcon } from "lucide-react";
import { UserRole, UserStatus } from "@/types/user";

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedRole?: UserRole[];
  onRoleChange: (role: UserRole[]) => void;
  selectedStatus?: UserStatus[];
  onStatusChange: (status: UserStatus[]) => void;
  onRefresh: () => void;
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
}: TopContentProps) {
  const roleOptions = [
    { key: "admin", label: "Admin" },
    { key: "manager", label: "Manager" },
    { key: "user", label: "User" },
    { key: "guest", label: "Guest" },
  ];

  const statusOptions = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "pending", label: "Pending" },
    { key: "suspended", label: "Suspended" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search users..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />

        <Select
          label="Role"
          placeholder="Filter by role"
          selectedKeys={selectedRole ? new Set(selectedRole) : new Set()}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys) as UserRole[];
            onRoleChange(selected);
          }}
          selectionMode="multiple"
          className="w-full sm:max-w-[200px]"
        >
          {roleOptions.map((role) => (
            <SelectItem key={role.key}>
              {role.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          placeholder="Filter by status"
          selectedKeys={selectedStatus ? new Set(selectedStatus) : new Set()}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys) as UserStatus[];
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
