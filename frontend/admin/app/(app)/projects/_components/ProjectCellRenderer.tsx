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
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
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
