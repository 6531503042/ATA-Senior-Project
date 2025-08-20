import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';

import ProjectCellRenderer from './ProjectCellRenderer';
import TopContent from './TopContent';
import BottomContent from './BottomContent';

import { Project, ProjectStatus } from '@/types/project';

const COLUMNS = [
  { name: 'PROJECT', uid: 'project', allowsSorting: false },
  { name: 'TIMELINE', uid: 'timeline', allowsSorting: true },
  { name: 'TEAM', uid: 'team', allowsSorting: false },
  { name: 'STATUS', uid: 'status', allowsSorting: true },
  { name: 'CATEGORY', uid: 'category', allowsSorting: true },
  { name: 'ACTIONS', uid: 'actions', allowsSorting: false },
];

type ProjectTableProps = {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onRefresh?: () => void;
};

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onRefresh,
}: ProjectTableProps) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'project',
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

  const handleStatusChange = (status: ProjectStatus[]) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    let filteredProjects = [...(projects ?? [])];
    const query = filterValue.toLowerCase();

    if (!!filterValue) {
      filteredProjects = projects.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query) ||
          project.client?.toLowerCase().includes(query) ||
          project.location?.toLowerCase().includes(query),
      );
    }

    // Filter by status
    if (selectedStatus.length > 0) {
      filteredProjects = filteredProjects.filter(project =>
        selectedStatus.includes(project.status),
      );
    }

    return filteredProjects;
  }, [projects, filterValue, selectedStatus]);

  const projectItems = useMemo(() => {
    const sortedItems = [...filteredItems];

    if (sortDescriptor.column && sortDescriptor.direction) {
      sortedItems.sort((a, b) => {
        const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

        if (sortDescriptor.column === 'status') {
          return a.status.localeCompare(b.status) * direction;
        }

        if (sortDescriptor.column === 'category') {
          const aCategory = a.category || '';
          const bCategory = b.category || '';

          return aCategory.localeCompare(bCategory) * direction;
        }

        if (sortDescriptor.column === 'timeline') {
          const aDate = new Date(a.timeline.startDate).getTime();
          const bDate = new Date(b.timeline.startDate).getTime();

          return (aDate - bDate) * direction;
        }

        return 0;
      });
    }

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, filteredItems, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const renderCell = useCallback(
    (project: Project, columnKey: Key) => {
      return (
        <ProjectCellRenderer
          columnKey={columnKey}
          project={project}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );
    },
    [onEdit, onDelete],
  );

  return (
    <Table
      isHeaderSticky
      aria-label="Projects Table"
      bottomContent={
        <BottomContent
          currentPage={page}
          page={page}
          pages={pages}
          setPage={setPage}
          totalProjects={filteredItems.length}
        />
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'shadow-none',
        table: 'min-h-[400px]',
        thead: 'bg-white sticky top-0 z-10 shadow-sm',
        th: 'text-default-700 font-semibold text-xs uppercase tracking-wide',
        tr: 'hover:bg-default-50 transition-colors',
        td: 'py-4',
      }}
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          filterValue={filterValue}
          selectedStatus={selectedStatus}
          onClear={handleClear}
          onRefresh={onRefresh || (() => {})}
          onSearchChange={handleSearch}
          onStatusChange={handleStatusChange}
        />
      }
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={COLUMNS}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-default-400">No projects found</span>
          </div>
        }
        items={[...projectItems]}
      >
        {(project: Project) => (
          <TableRow
            key={project.id}
            className="hover:bg-default-50 transition-colors"
          >
            {columnKey => (
              <TableCell className={`${columnKey.toString()} py-4`}>
                {renderCell(project, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
