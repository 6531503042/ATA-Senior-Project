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
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import DepartmentCellRenderer from './DepartmentCellRenderer';
import TopContent from './TopContent';

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
        sortedItems.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() * direction,
        );
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
    (department: Department, columnKey: Key) => {
      const cellValue = department[columnKey as keyof Department];

      switch (columnKey) {
        case 'name':
          return (
            <div className="flex flex-col gap-1">
              <p className="text-bold text-small capitalize text-default-900">{department.name}</p>
              {department.description && (
                <p className="text-default-500 text-xs leading-relaxed max-w-xs">
                  {department.description}
                </p>
              )}
            </div>
          );
        case 'memberCount':
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-50 rounded-full">
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-bold text-small text-default-900">
                  {department.memberCount}
                </span>
                <span className="text-xs text-default-500">
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
            <div className="flex flex-col gap-1">
              <p className="text-bold text-small text-default-900">
                {new Date(department.createdAt).toLocaleDateString()}
              </p>
              <p className="text-default-500 text-xs">
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
    <div className="w-full">
      <Table
        aria-label="Departments table with pagination"
        isHeaderSticky
        bottomContent={
          <div className="flex w-full justify-center">
            <div className="flex w-full justify-center gap-2">
              <button
                className="px-3 py-2 text-sm text-default-500 bg-default-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-default-200 transition-colors"
                disabled={page === 1}
                onClick={onPreviousPage}
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      page === i + 1
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-default-500 bg-default-100 hover:bg-default-200'
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="px-3 py-2 text-sm text-default-500 bg-default-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-default-200 transition-colors"
                disabled={page === pages}
                onClick={onNextPage}
              >
                Next
              </button>
            </div>
          </div>
        }
        classNames={{
          wrapper: 'max-h-[600px]',
          table: 'min-h-[400px]',
          thead: 'bg-default-50',
          th: 'text-default-600 font-semibold text-sm uppercase tracking-wider',
          td: 'py-4',
          tr: 'hover:bg-default-50 transition-colors',
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
    </div>
  );
}
