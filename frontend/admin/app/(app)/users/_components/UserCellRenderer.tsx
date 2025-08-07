import { User } from "@/types/user";
import { Key } from "react";
import { Avatar, Chip, Button } from "@heroui/react";
import { EditIcon, TrashIcon, UserIcon, ShieldIcon, ClockIcon, BuildingIcon } from "lucide-react";
import { 
  formatUserRole, 
  formatUserStatus, 
  getUserRoleColor, 
  getUserStatusColor, 
  getUserInitials, 
  formatDate 
} from "@/services/userService";

export type UserColumnKey =
  | "user"
  | "role"
  | "status"
  | "department"
  | "lastLogin"
  | "actions";

type UserCellRendererProps = {
  user: User;
  columnKey: Key;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
};

export default function UserCellRenderer({
  user,
  columnKey,
  onEdit,
  onDelete,
}: UserCellRendererProps) {
  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldIcon className="w-4 h-4" />;
      case 'manager':
        return <UserIcon className="w-4 h-4" />;
      case 'user':
        return <UserIcon className="w-4 h-4" />;
      case 'guest':
        return <UserIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  switch (columnKey) {
    case "user":
      return (
        <div className="flex items-start gap-3 group">
          <Avatar
            src={user.avatar}
            name={`${user.firstName} ${user.lastName}`}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            showFallback
          >
            {getUserInitials(user.firstName, user.lastName)}
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-default-500 mb-1">
              @{user.username}
            </p>
            <p className="text-xs text-default-400 line-clamp-1">
              {user.email}
            </p>
            {user.position && (
              <div className="mt-2">
                <span className="text-xs text-default-500 bg-default-100 px-2 py-1 rounded-md">
                  {user.position}
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "role":
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg shadow-sm">
            {getRoleIcon(user.role)}
          </div>
          <Chip
            size="sm"
            color={getUserRoleColor(user.role) as any}
            variant="flat"
            className="font-medium capitalize shadow-sm"
          >
            {formatUserRole(user.role)}
          </Chip>
        </div>
      );

    case "status":
      return (
        <Chip
          size="sm"
          color={getUserStatusColor(user.status) as any}
          variant="flat"
          className="font-medium capitalize shadow-sm"
        >
          {formatUserStatus(user.status)}
        </Chip>
      );

    case "department":
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg shadow-sm">
            <BuildingIcon className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-sm font-medium text-default-700">
            {user.department || 'N/A'}
          </span>
        </div>
      );

    case "lastLogin":
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg shadow-sm">
            <ClockIcon className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-sm text-default-600">
            {formatDate(user.lastLogin)}
          </span>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            onPress={() => onEdit?.(user)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
            onPress={() => onDelete?.(user.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return <span>-</span>;
  }
}
