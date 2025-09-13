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
  Badge,
  Pagination,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import DepartmentCellRenderer from './DepartmentCellRenderer';
import TopContent from './TopContent';
import BottomContent from './BottomContent';

export type Department = {
  id: string;
  name: string;
  memberCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  description?: string;
};

const COLUMNS = [
  { name: 'NAME', uid: 'name', allowsSorting: true },
  { name: 'MEMBERS', uid: 'memberCount', allowsSorting: true },
  { name: 'STATUS', uid: 'status', allowsSorting: true },
  { name: 'CREATED AT', uid: 'createdAt', allowsSorting: true },
  { name: 'ACTIONS', uid: 'actions', allowsSorting: false },
];

type DepartmentsTableProps = {
  departments: Department[];
  onEdit?: (department: Department) => void;
  onDelete?: (id: string) => void;
  onView?: (department: Department) => void;
  onRefresh?: () => void;
};

export default function DepartmentsTable({
  departments,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}: DepartmentsTableProps) {
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
    let filtered = [...(departments ?? [])];
    const query = filterValue.toLowerCase();

    if (filterValue) {
      filtered = filtered.filter(
        dept =>
          dept.name.toLowerCase().includes(query) ||
          dept.status.toLowerCase().includes(query),
      );
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter(dept => selectedStatus.includes(dept.status));
    }

    return filtered;
  }, [departments, filterValue, selectedStatus]);

  const departmentItems = useMemo(() => {
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
      case 'createdAt':
        sortedItems.sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return (aTime - bTime) * direction;
        });
        break;
      default:
        break;
    }

    return sortedItems;
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(departmentItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return departmentItems.slice(start, end);
  }, [page, departmentItems, rowsPerPage]);

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
    (department: Department, columnKey: Key) => {
      const cellValue = department[columnKey as keyof Department];

      switch (columnKey) {
        case 'name':
          return (
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-default-900">{department.name}</p>
              {department.description && (
                <p className="text-default-500 text-xs leading-snug max-w-md line-clamp-1">
                  {department.description}
                </p>
              )}
            </div>
          );
        case 'memberCount':
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-primary-50 rounded-full">
                <Users className="w-3.5 h-3.5 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-default-900 text-sm">{department.memberCount}</span>
                <span className="text-[11px] text-default-500">
                  {department.memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>
          );
        case 'status':
          return (
            <Chip
              className="capitalize font-medium"
              color={department.status === 'active' ? 'success' : 'danger'}
              size="sm"
              variant="flat"
              radius="lg"
            >
              {department.status}
            </Chip>
          );
        case 'createdAt':
          return (
            <div className="flex flex-col gap-0.5">
              <p className="text-default-900 text-sm">
                {new Date(department.createdAt).toLocaleDateString()}
              </p>
              <p className="text-default-500 text-[11px]">
                {new Date(department.createdAt).toLocaleTimeString()}
              </p>
            </div>
          );
        case 'actions':
          return (
            <DepartmentCellRenderer
              department={department}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          );
        default:
          return cellValue;
      }
    },
    [onEdit, onDelete, onView],
  );

  return (
    <div className="w-full flex flex-col">
      <Table
        aria-label="Departments table with pagination"
        classNames={{
          wrapper: 'min-w-full overflow-visible',
          table: 'min-w-full',
          thead: 'bg-default-50 dark:bg-default-100',
          th: 'text-default-600 dark:text-default-400 font-semibold text-xs uppercase tracking-wide py-2',
          td: 'py-3',
          tr: 'hover:bg-default-50 dark:hover:bg-default-100 transition-colors',
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
        <TableBody emptyContent={'No departments found'} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <BottomContent
        page={page}
        pages={pages}
        setPage={setPage}
        totalDepartments={departmentItems.length}
        currentPage={page}
      />
    </div>
  );
}
