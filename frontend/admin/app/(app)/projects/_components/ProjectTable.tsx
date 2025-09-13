'use client';

import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';
import { Users, Calendar, Tag } from 'lucide-react';

import ProjectCellRenderer from './ProjectCellRenderer';
import TopContent from './TopContent';
import BottomContent from './BottomContent';

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

const COLUMNS = [
  { name: 'NAME', uid: 'name', allowsSorting: true },
  { name: 'MEMBERS', uid: 'memberCount', allowsSorting: true },
  { name: 'STATUS', uid: 'status', allowsSorting: true },
  { name: 'TIMELINE', uid: 'timeline', allowsSorting: true },
  { name: 'CREATED AT', uid: 'createdAt', allowsSorting: true },
  { name: 'ACTIONS', uid: 'actions', allowsSorting: false },
];

type ProjectTableProps = {
  projects: ProjectTableItem[];
  onEdit?: (project: ProjectTableItem) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
};

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onRefresh,
}: ProjectTableProps) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSearch = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const handleClear = () => {
    setFilterValue('');
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    let filtered = [...(projects ?? [])];
    const query = filterValue.toLowerCase();

    if (filterValue) {
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query),
      );
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter(project => selectedStatus.includes(project.status));
    }

    return filtered;
  }, [projects, filterValue, selectedStatus]);

  const projectItems = useMemo(() => {
    const sortedItems = [...filteredItems];
        const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

    switch (sortDescriptor.column) {
      case 'name':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name) * direction);
        break;
      case 'memberCount':
        sortedItems.sort(
          (a, b) => (a.memberCount - b.memberCount) * direction,
        );
        break;
      case 'status':
        sortedItems.sort(
          (a, b) => a.status.localeCompare(b.status) * direction,
        );
        break;
      case 'timeline':
        sortedItems.sort(
          (a, b) => {
            const aDate = new Date(a.startDate || '').getTime();
            const bDate = new Date(b.startDate || '').getTime();
          return (aDate - bDate) * direction;
          },
        );
        break;
      case 'createdAt':
        sortedItems.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() * direction,
        );
        break;
      default:
        break;
    }

    return sortedItems;
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(projectItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return projectItems.slice(start, end);
  }, [page, projectItems, rowsPerPage]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(() => {
    setPage(1);
  }, []);

  const onSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const topContent = useMemo(
    () => (
      <TopContent
        filterValue={filterValue}
        onClear={handleClear}
        onSearchChange={handleSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onRefresh={onRefresh || (() => {})}
      />
    ),
    [filterValue, selectedStatus, onRefresh],
  );

  const renderCell = useCallback(
    (project: ProjectTableItem, columnKey: Key) => {
      const cellValue = project[columnKey as keyof ProjectTableItem];

      switch (columnKey) {
        case 'name':
          return (
            <div className="flex items-start gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-bold text-small capitalize text-default-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {project.name}
                </p>
                {project.description && (
                  <p className="text-default-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          );
        case 'memberCount':
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-50 rounded-full">
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-bold text-small text-default-900 dark:text-white">
                  {project.memberCount}
                </span>
                <span className="text-xs text-default-500 dark:text-gray-400">
                  {project.memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>
          );
        case 'status':
          return (
            <Chip
              className="capitalize font-medium"
              color={project.status === 'active' ? 'success' : 'danger'}
              size="sm"
              variant="flat"
              radius="lg"
            >
              {project.status}
            </Chip>
          );
        case 'timeline':
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-green-500" />
                <span className="text-xs text-default-600 dark:text-gray-300">
                  Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-default-600 dark:text-gray-300">
                  End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          );
        case 'createdAt':
          return (
            <div className="flex flex-col gap-1">
              <p className="text-bold text-small text-default-900 dark:text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="text-default-500 dark:text-gray-400 text-xs">
                {new Date(project.createdAt).toLocaleTimeString()}
              </p>
            </div>
          );
        case 'actions':
      return (
        <ProjectCellRenderer
          project={project}
              onEdit={onEdit}
          onDelete={onDelete}
        />
      );
        default:
          return cellValue;
      }
    },
    [onEdit, onDelete],
  );

  return (
    <div className="w-full flex flex-col">
      <Table
        aria-label="Projects table with pagination"
        classNames={{
          wrapper: 'min-w-full overflow-visible',
          table: 'min-w-full',
          thead: 'bg-default-50 dark:bg-gray-800',
          th: 'text-default-600 dark:text-gray-300 font-semibold text-sm uppercase tracking-wider',
          td: 'py-3',
          tr: 'hover:bg-default-50 dark:hover:bg-gray-700 transition-colors',
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={onSortChange}
      >
      <TableHeader columns={COLUMNS}>
          {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
        <TableBody emptyContent={'No projects found'} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>

      {/* Pagination at Bottom */}
      <BottomContent
        page={page}
        pages={pages}
        setPage={setPage}
        totalProjects={projectItems.length}
        currentPage={page}
      />
    </div>
  );
}
