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
  MoreVerticalIcon,
  EyeIcon,
  CopyIcon,
  ArchiveIcon,
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
    <div className="flex items-center gap-2 justify-center">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="primary"
        onPress={() => onEdit?.(department)}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
        title="Edit department"
      >
        <EditIcon className="w-4 h-4" />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="danger"
        onPress={() => onDelete?.(department.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
        title="Delete department"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
      
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-600 hover:text-default-700 hover:bg-default-50 transition-all duration-200"
            title="More options"
          >
            <MoreVerticalIcon className="w-4 h-4" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Department actions">
          <DropdownItem
            key="view"
            startContent={<EyeIcon className="w-4 h-4" />}
            onPress={() => onView?.(department)}
            className="text-default-600"
          >
            View Details
          </DropdownItem>
          <DropdownItem
            key="edit"
            startContent={<EditIcon className="w-4 h-4" />}
            onPress={() => onEdit?.(department)}
            className="text-blue-600"
          >
            Edit Department
          </DropdownItem>
          <DropdownItem
            key="duplicate"
            startContent={<CopyIcon className="w-4 h-4" />}
            onPress={() => {}}
            className="text-purple-600"
          >
            Duplicate
          </DropdownItem>
          <DropdownItem
            key="archive"
            startContent={<ArchiveIcon className="w-4 h-4" />}
            onPress={() => {}}
            className="text-orange-600"
          >
            Archive
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<TrashIcon className="w-4 h-4" />}
            onPress={() => onDelete?.(department.id)}
          >
            Delete Department
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
