import { Key } from 'react';
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  EditIcon,
  TrashIcon,
  UserIcon,
  ShieldIcon,
  ClockIcon,
  BuildingIcon,
  EyeIcon,
  EllipsisVertical,
} from 'lucide-react';

import { User } from '@/types/user';
import {
  formatUserRole,
  formatUserStatus,
  getUserRoleColor,
  getUserStatusColor,
  formatDate,
} from '@/services/userService';

export type UserColumnKey =
  | 'user'
  | 'role'
  | 'status'
  | 'department'
  | 'lastLogin'
  | 'actions';

type UserCellRendererProps = {
  user: User;
  columnKey: Key;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onView?: (user: User) => void;
};

export default function UserCellRenderer({
  user,
  columnKey,
  onEdit,
  onDelete,
  onView,
}: UserCellRendererProps) {
  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldIcon className="w-4 h-4" />;
      case 'manager':
      case 'user':
      case 'guest':
        return <UserIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  switch (columnKey) {
    case 'user':
      return (
        <div className="min-w-0 flex flex-col">
          <h3 className="font-medium text-default-900 text-sm mb-0.5 line-clamp-1">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-default-500 line-clamp-1">
            @{user.username}
          </p>
          <p className="text-xs text-default-400 line-clamp-1">{user.email}</p>
          {user.position && (
            <span className="mt-1.5 w-fit text-[11px] text-default-600 bg-default-100 px-2 py-1 rounded-md">
              {user.position}
            </span>
          )}
        </div>
      );

    case 'role':
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-default-100 text-default-600">
            {getRoleIcon(user.role)}
          </div>
          <Chip
            className="font-medium capitalize"
            color={getUserRoleColor(user.role) as any}
            size="sm"
            variant="flat"
          >
            {formatUserRole(user.role)}
          </Chip>
        </div>
      );

    case 'status':
      return (
        <Chip
          className="font-medium capitalize"
          color={getUserStatusColor(user.status) as any}
          size="sm"
          variant="flat"
        >
          {formatUserStatus(user.status)}
        </Chip>
      );

    case 'department':
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-default-100 text-default-600">
            <BuildingIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-default-700">
            {user.department || 'N/A'}
          </span>
        </div>
      );

    case 'lastLogin':
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-default-100 text-default-600">
            <ClockIcon className="w-4 h-4" />
          </div>
          <span className="text-sm text-default-600">
            {formatDate(user.lastLogin || null)}
          </span>
        </div>
      );

    case 'actions':
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <EllipsisVertical className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key="view"
              startContent={<EyeIcon size={16} />}
              onPress={() => onView?.(user)}
            >
              View Details
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<EditIcon size={16} />}
              onPress={() => onEdit?.(user)}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon size={16} />}
              onPress={() => onDelete?.(user.id)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );

    default:
      return <span>-</span>;
  }
}
