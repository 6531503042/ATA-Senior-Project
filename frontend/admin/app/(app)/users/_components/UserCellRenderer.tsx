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

// User utility functions
function formatUserRole(role: string): string {
  if (!role) return 'User';
  
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function formatUserStatus(status: string | boolean): string {
  if (typeof status === 'boolean') {
    return status ? 'Active' : 'Inactive';
  }
  
  if (!status) return 'Inactive';
  
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getUserRoleColor(role: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'danger';
    case 'manager':
      return 'warning';
    case 'user':
      return 'primary';
    case 'guest':
      return 'secondary';
    default:
      return 'default';
  }
}

function getUserStatusColor(status: string | boolean): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  if (typeof status === 'boolean') {
    return status ? 'success' : 'danger';
  }
  
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    case 'pending':
      return 'warning';
    case 'suspended':
      return 'danger';
    default:
      return 'default';
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

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
  // Helper functions to get role and status with fallbacks
  const getUserRole = () => {
    if (user.roles) return user.roles;
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].toLowerCase();
    }

    return 'user';
  };

  const getUserStatus = () => {
    if (user.status) return user.status;

    return user.active ? 'active' : 'inactive';
  };

  const getUserDepartment = () => {
    if (user.department) return user.department;
    if (user.departments && user.departments.length > 0) {
      return user.departments[0].name;
    }

    return 'N/A';
  };

  const getUserLastLogin = () => {
    return user.lastLogin || user.lastLoginAt || null;
  };

  const getRoleIcon = (role: string) => {
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
            {user.email}
          </p>
        </div>
      );

    case 'role':
      const role = getUserRole();
      return (
        <div className="flex items-center gap-2">
          {getRoleIcon(role)}
          <Chip
            size="sm"
            color={getUserRoleColor(role)}
            variant="flat"
            className="text-xs"
          >
            {formatUserRole(role)}
          </Chip>
        </div>
      );

    case 'status':
      const status = getUserStatus();
      return (
        <Chip
          size="sm"
          color={getUserStatusColor(status)}
          variant="flat"
          className="text-xs"
        >
          {formatUserStatus(status)}
        </Chip>
      );

    case 'department':
      return (
        <div className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-default-400" />
          <span className="text-sm text-default-600">
            {getUserDepartment()}
          </span>
        </div>
      );

    case 'lastLogin':
      const lastLogin = getUserLastLogin();
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-default-400" />
          <span className="text-sm text-default-600">
            {formatDate(lastLogin)}
          </span>
        </div>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onView(user)}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEdit(user)}
            >
              <EditIcon className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                >
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="delete"
                  color="danger"
                  startContent={<TrashIcon className="w-4 h-4" />}
                  onPress={() => onDelete(user.id.toString())}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      );

    default:
      return null;
  }
}
