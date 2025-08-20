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
import { SearchIcon, RefreshCwIcon, EllipsisVertical } from 'lucide-react';

import { UserRole, UserStatus } from '@/types/user';

type TopContentProps = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  selectedRole?: UserRole[];
  onRoleChange: (role: UserRole[]) => void;
  selectedStatus?: UserStatus[];
  onStatusChange: (status: UserStatus[]) => void;
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
  const roleOptions = [
    { key: 'admin', label: 'Admin' },
    { key: 'manager', label: 'Manager' },
    { key: 'user', label: 'User' },
    { key: 'guest', label: 'Guest' },
  ];

  const statusOptions = [
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
    { key: 'pending', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-3 flex-wrap">
        {/* Stretch search to fill available space */}
        <div className="flex-1 min-w-[260px]">
          <Input
            isClearable
            className="w-full"
            placeholder="Search users..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={filterValue}
            variant="bordered"
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>

        {/* Group: filters + refresh + more (and optional add) */}
        <div className="flex items-end gap-3">
          <Select
            className="w-[180px]"
            label="Role"
            placeholder="All roles"
            selectedKeys={selectedRole ? new Set(selectedRole) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as UserRole[];

              onRoleChange(selected);
            }}
          >
            {roleOptions.map(role => (
              <SelectItem key={role.key}>{role.label}</SelectItem>
            ))}
          </Select>

          <Select
            className="w-[180px]"
            label="Status"
            placeholder="All status"
            selectedKeys={selectedStatus ? new Set(selectedStatus) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as UserStatus[];

              onStatusChange(selected);
            }}
          >
            {statusOptions.map(status => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
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
              {onEditSelected ? (
                <DropdownItem key="edit" onPress={onEditSelected}>
                  Edit Selected
                </DropdownItem>
              ) : null}
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
            <Button color="primary" onPress={onAdd}>
              Add User
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
