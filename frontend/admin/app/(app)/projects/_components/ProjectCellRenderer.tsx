import { Project } from "@/types/project";
import { Key } from "react";
import { Avatar, AvatarGroup, Chip, Button } from "@heroui/react";
import { CalendarIcon, TagIcon, MapPinIcon, EditIcon, TrashIcon } from "lucide-react";

export type ProjectColumnKey =
  | "project"
  | "timeline"
  | "team"
  | "status"
  | "category"
  | "actions";

type ProjectCellRendererProps = {
  project: Project;
  columnKey: Key;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
};

export default function ProjectCellRenderer({
  project,
  columnKey,
  onEdit,
  onDelete,
}: ProjectCellRendererProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  switch (columnKey) {
    case "project":
      return (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {project.initial}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-xs text-default-500 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            {project.category && (
              <div className="flex items-center gap-1 mt-1">
                <TagIcon className="w-3 h-3 text-default-400" />
                <span className="text-xs text-default-400">{project.category}</span>
              </div>
            )}
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-default-600">
            <CalendarIcon className="w-3 h-3" />
            <span>Start: {formatDate(project.timeline.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-default-600">
            <CalendarIcon className="w-3 h-3" />
            <span>End: {formatDate(project.timeline.endDate)}</span>
          </div>
          {project.timeline.duration && (
            <div className="text-xs text-default-500">
              Duration: {project.timeline.duration} days
            </div>
          )}
        </div>
      );

    case "team":
      return (
        <div className="flex items-center gap-2">
          {project.team.length > 0 ? (
            <>
              <AvatarGroup size="sm" max={3}>
                {project.team.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    name={member.name}
                    className="w-8 h-8"
                  />
                ))}
              </AvatarGroup>
              <span className="text-xs text-default-500">
                {project.team.length} member{project.team.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span className="text-xs text-default-400">No team assigned</span>
          )}
        </div>
      );

    case "status":
      return (
        <Chip
          size="sm"
          color={getStatusColor(project.status)}
          variant="flat"
          className="font-medium capitalize"
        >
          {project.status}
        </Chip>
      );

    case "category":
      return (
        <div className="flex items-center gap-1">
          <TagIcon className="w-3 h-3 text-default-400" />
          <span className="text-sm font-medium text-default-700">
            {project.category || 'N/A'}
          </span>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-blue-600"
            onPress={() => onEdit?.(project)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-red-600"
            onPress={() => onDelete?.(project.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return <span>-</span>;
  }
}
