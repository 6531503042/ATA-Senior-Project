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
        <div className="flex items-start gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            {project.initial}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-default-500 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            {project.category && (
              <div className="flex items-center gap-1 mt-2">
                <div className="p-1 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50">
                  <TagIcon className="w-3 h-3 text-blue-500" />
                </div>
                <span className="text-xs text-blue-600 font-medium">{project.category}</span>
              </div>
            )}
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-default-600">
            <div className="p-1 rounded-md bg-gradient-to-r from-green-50 to-emerald-50">
              <CalendarIcon className="w-3 h-3 text-green-500" />
            </div>
            <span className="font-medium">Start: {formatDate(project.timeline.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-default-600">
            <div className="p-1 rounded-md bg-gradient-to-r from-orange-50 to-amber-50">
              <CalendarIcon className="w-3 h-3 text-orange-500" />
            </div>
            <span className="font-medium">End: {formatDate(project.timeline.endDate)}</span>
          </div>
          {project.timeline.duration && (
            <div className="text-xs text-default-500 bg-gradient-to-r from-purple-50 to-violet-50 px-2 py-1 rounded-md inline-block">
              Duration: {project.timeline.duration} days
            </div>
          )}
        </div>
      );

    case "team":
      return (
        <div className="flex items-center gap-3">
          {project.team.length > 0 ? (
            <>
              <AvatarGroup size="sm" max={3} className="shadow-md">
                {project.team.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    name={member.name}
                    className="w-8 h-8 shadow-sm border-2 border-white"
                  />
                ))}
              </AvatarGroup>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-blue-600">
                  {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                </span>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-lg">
              <span className="text-xs text-gray-500">No team assigned</span>
            </div>
          )}
        </div>
      );

    case "status":
      return (
        <Chip
          size="sm"
          color={getStatusColor(project.status)}
          variant="flat"
          className="font-medium capitalize shadow-md hover:shadow-lg transition-all duration-200"
        >
          {project.status}
        </Chip>
      );

    case "category":
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 shadow-sm">
            <TagIcon className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-sm font-medium text-default-700">
            {project.category || 'N/A'}
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
            className="text-default-400 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md"
            onPress={() => onEdit?.(project)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
