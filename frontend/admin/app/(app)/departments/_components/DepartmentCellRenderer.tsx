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
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  EllipsisVertical,
  EyeIcon,
} from 'lucide-react';

type Department = {
  id: string;
  name: string;
  memberCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  description?: string;
};

type DepartmentCellRendererProps = {
  department: Department;
  onEdit?: (department: Department) => void;
  onDelete?: (departmentId: string) => void;
  onView?: (department: Department) => void;
};

export default function DepartmentCellRenderer({
  department,
  onEdit,
  onDelete,
  onView,
}: DepartmentCellRendererProps) {
  return (
    <div className="flex items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Department actions">
          {onView ? (
            <DropdownItem
              key="view"
              startContent={<EyeIcon className="w-4 h-4" />}
              onClick={() => onView(department)}
            >
              View Details
            </DropdownItem>
          ) : null}
          {onEdit ? (
            <DropdownItem
              key="edit"
              startContent={<EditIcon className="w-4 h-4" />}
              onClick={() => onEdit(department)}
            >
              Edit Department
            </DropdownItem>
          ) : null}
          {onDelete ? (
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon className="w-4 h-4" />}
              onClick={() => onDelete(department.id)}
            >
              Delete Department
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
