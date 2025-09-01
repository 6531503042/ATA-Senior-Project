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

// Utils
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

function getUserRoleColor(
  role: string
): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
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

function getUserStatusColor(
  status: string | boolean
): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
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

function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export type UserColumnKey = 'user' | 'role' | 'status' | 'department' | 'lastLogin' | 'actions';

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
  // Role
  const getUserRole = () => {
    const roles = user?.roles as unknown;
    if (Array.isArray(roles) && roles.length > 0) {
      const r0 = typeof roles[0] === 'string' ? roles[0] : '';
      return r0 ? r0.toLowerCase() : 'user';
    }
    if (typeof roles === 'string' && roles.length > 0) {
      return roles.toLowerCase();
    }
    return 'user';
  };

  // Status: normalize to string
  const getUserStatus = (): 'active' | 'inactive' | 'pending' | 'suspended' => {
    // If your model stores boolean, map here:
    if (typeof user?.active === 'boolean') {
      return user.active ? 'active' : 'inactive';
    }
    // Or if it stores string:
    const s = (user as any)?.status ?? (user as any)?.active;
    const normalized = typeof s === 'string' ? s.toLowerCase() : '';
    if (['active', 'inactive', 'pending', 'suspended'].includes(normalized)) {
      return normalized as any;
    }
    return 'inactive';
  };

  // Department: return a readable string
  const getUserDepartment = (): string => {
    const deps = (user as any)?.departments;
    if (Array.isArray(deps) && deps.length > 0) {
      // common shapes: [{ name: 'Engineering' }] or ['Engineering']
      const first = deps[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.name === 'string') return first.name;
    }
    if (typeof deps === 'string' && deps) return deps;
    return 'N/A';
  };

  const getUserLastLogin = (): string | null => {
    return (user as any)?.lastLoginAt || null;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldIcon className="w-4 h-4" />;
      case 'manager':
      case 'user':
      case 'guest':
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
          <p className="text-xs text-default-500 line-clamp-1">{user.email}</p>
        </div>
      );

    case 'role': {
      const role = getUserRole();
      return (
        <div className="flex items-center gap-2">
          {getRoleIcon(role)}
          <Chip size="sm" color={getUserRoleColor(role)} variant="flat" className="text-xs">
            {formatUserRole(role)}
          </Chip>
        </div>
      );
    }

    case 'status': {
      const status = getUserStatus();
      return (
        <Chip size="sm" color={getUserStatusColor(status)} variant="flat" className="text-xs">
          {formatUserStatus(status)}
        </Chip>
      );
    }

    case 'department':
      return (
        <div className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-default-400" />
          <span className="text-sm text-default-600">{getUserDepartment()}</span>
        </div>
      );

    case 'lastLogin': {
      const lastLogin = getUserLastLogin();
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-default-400" />
          <span className="text-sm text-default-600">{formatDate(lastLogin)}</span>
        </div>
      );
    }

    case 'actions':
      return (
        <div className="flex items-center gap-2">
          {onView && (
            <Button isIconOnly size="sm" variant="light" onPress={() => onView(user)}>
              <EyeIcon className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(user)}>
              <EditIcon className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="More actions">
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="delete"
                  color="danger"
                  startContent={<TrashIcon className="w-4 h-4" />}
                  onPress={() => onDelete(String((user as any).id))}
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
