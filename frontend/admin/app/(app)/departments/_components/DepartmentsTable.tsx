'use client';

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

import DepartmentCellRenderer from './DepartmentCellRenderer';
import TopContent from './TopContent';

export type Department = {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
};

const COLUMNS = [
  { name: 'NAME', uid: 'name', allowsSorting: true },
  { name: 'MANAGER', uid: 'manager', allowsSorting: true },
  { name: 'EMPLOYEES', uid: 'employeeCount', allowsSorting: true },
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
          dept.manager.toLowerCase().includes(query) ||
          dept.status.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [departments, filterValue]);

  const departmentItems = useMemo(() => {
    const sortedItems = [...filteredItems];
    const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

    switch (sortDescriptor.column) {
      case 'name':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name) * direction);
        break;
      case 'manager':
        sortedItems.sort(
          (a, b) => a.manager.localeCompare(b.manager) * direction,
        );
        break;
      case 'employeeCount':
        sortedItems.sort(
          (a, b) => (a.employeeCount - b.employeeCount) * direction,
        );
        break;
      case 'status':
        sortedItems.sort(
          (a, b) => a.status.localeCompare(b.status) * direction,
        );
        break;
      case 'createdAt':
        sortedItems.sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();

          return (aDate - bDate) * direction;
        });
        break;
    }

    const start = (page - 1) * rowsPerPage;

    return sortedItems.slice(start, start + rowsPerPage);
  }, [filteredItems, sortDescriptor, page]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const renderCell = useCallback(
    (department: Department, columnKey: Key) => (
      <DepartmentCellRenderer
        columnKey={columnKey}
        department={department}
        onDelete={onDelete}
        onEdit={onEdit}
        onView={onView}
      />
    ),
    [onEdit, onDelete, onView],
  );

  return (
    <Table
      aria-label="Departments Table"
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          filterValue={filterValue}
          selectedStatus={[]}
          onClear={handleClear}
          onRefresh={onRefresh || (() => {})}
          onSearchChange={handleSearch}
          onStatusChange={() => {}}
        />
      }
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={COLUMNS}>
        {column => (
          <TableColumn key={column.uid} allowsSorting={column.allowsSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No departments found" items={departmentItems}>
        {(dept: Department) => (
          <TableRow key={dept.id}>
            {columnKey => <TableCell>{renderCell(dept, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
