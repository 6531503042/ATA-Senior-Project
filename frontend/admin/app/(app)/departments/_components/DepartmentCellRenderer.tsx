import { Key } from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  EditIcon,
  TrashIcon,
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  EllipsisVertical,
  EyeIcon,
} from "lucide-react";


type Department = {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type DepartmentColumnKey =
  | "name"
  | "manager"
  | "employeeCount"
  | "status"
  | "createdAt"
  | "actions";

type DepartmentCellRendererProps = {
  department: Department;
  columnKey: Key;
  onEdit?: (department: Department) => void;
  onDelete?: (departmentId: string) => void;
  onView?: (department: Department) => void;
};

export default function DepartmentCellRenderer({
  department,
  columnKey,
  onEdit,
  onDelete,
  onView,
}: DepartmentCellRendererProps) {
  switch (columnKey) {
    case "name":
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-default-100 text-default-600">
            <BuildingIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-default-700">
            {department.name}
          </span>
        </div>
      );

    case "manager":
      return (
        <span className="text-sm text-default-600">
          {department.manager || "N/A"}
        </span>
      );

    case "employeeCount":
      return (
        <div className="flex items-center gap-1">
          <UsersIcon className="w-4 h-4 text-default-500" />
          <span className="text-sm">{department.employeeCount ?? 0}</span>
        </div>
      );

    case "status":
      return (
        <Chip
          size="sm"
          color={department.status === "active" ? "success" : "danger"}
          variant="flat"
          className="capitalize font-medium"
        >
          {department.status || "inactive"}
        </Chip>
      );

    case "createdAt":
      return (
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-default-500" />
          <span className="text-sm text-default-600">
            {/* {formatDate(department.createdAt || null)} */}
          </span>
        </div>
      );

    case "actions":
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
              onPress={() => onView?.(department)}
            >
              View Details
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<EditIcon size={16} />}
              onPress={() => onEdit?.(department)}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon size={16} />}
              onPress={() => onDelete?.(department.id)}
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
