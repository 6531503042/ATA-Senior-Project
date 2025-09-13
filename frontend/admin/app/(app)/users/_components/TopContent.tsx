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
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <Input
            isClearable
            className="w-full"
            placeholder="Search users..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400 dark:text-default-500" />}
            value={filterValue}
            variant="bordered"
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="flex items-end gap-3">
          <Select
            className="w-[180px]"
            label="Role"
            placeholder="All roles"
            selectedKeys={selectedRole.length > 0 ? new Set(selectedRole) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as string[];
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
            selectedKeys={selectedStatus.length > 0 ? new Set(selectedStatus.map(s => s ? 'active' : 'inactive')) : new Set()}
            selectionMode="multiple"
            onSelectionChange={keys => {
              const selected = Array.from(keys) as string[];
              const statusArray = selected.map(s => s === 'active');
              onStatusChange(statusArray);
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
              Add User
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
