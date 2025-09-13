import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  EditIcon,
  TrashIcon,
  EllipsisVertical,
} from 'lucide-react';

export type ProjectTableItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
  createdAt: string;
};

type ProjectCellRendererProps = {
  project: ProjectTableItem;
  onEdit?: (project: ProjectTableItem) => void;
  onDelete?: (projectId: string) => void;
};

export default function ProjectCellRenderer({
  project,
  onEdit,
  onDelete,
}: ProjectCellRendererProps) {
  return (
    <div className="flex items-center gap-2">
      {onEdit ? (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="primary"
          onPress={() => onEdit(project)}
          aria-label="Edit project"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
        >
          <EditIcon className="w-4 h-4" />
        </Button>
      ) : null}

      {onDelete ? (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(project.id)}
          aria-label="Delete project"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      ) : null}

      <Dropdown>
        <DropdownTrigger>
          <Button 
            isIconOnly 
            size="sm" 
            variant="light"
            className="text-default-600 hover:text-default-700 hover:bg-default-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Project actions">
          {onEdit ? (
            <DropdownItem
              key="edit"
              startContent={<EditIcon className="w-4 h-4" />}
              onClick={() => onEdit(project)}
            >
              Edit Project
            </DropdownItem>
          ) : null}
          {onDelete ? (
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon className="w-4 h-4" />}
              onClick={() => onDelete(project.id)}
            >
              Delete Project
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
