import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';

import UserCellRenderer from './UserCellRenderer';
import TopContent from './TopContent';
import BottomContent from './BottomContent';

import { User } from '@/types/user';

const COLUMNS = [
  { name: 'USER', uid: 'user', allowsSorting: false },
  { name: 'ROLE', uid: 'role', allowsSorting: true },
  { name: 'STATUS', uid: 'status', allowsSorting: true },
  { name: 'DEPARTMENT', uid: 'department', allowsSorting: true },
  { name: 'LAST LOGIN', uid: 'lastLogin', allowsSorting: true },
  { name: 'ACTIONS', uid: 'actions', allowsSorting: false },
];

type UserTableProps = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onView?: (user: User) => void;
  onRefresh?: () => void;
  filterValue: string;
  selectedRole: string[];
  selectedStatus: boolean[];
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onRoleChange: (role: string[]) => void;
  onStatusChange: (status: boolean[]) => void;
};

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  filterValue,
  selectedRole,
  selectedStatus,
  onSearchChange,
  onClear,
  onRoleChange,
  onStatusChange,
}: UserTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'user',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(users ?? [])];
    const query = filterValue.toLowerCase();

    if (!!filterValue) {
      filteredUsers = users.filter(
        user =>
          user.username.toLowerCase().includes(query) ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.departments && Array.isArray(user.departments) && user.departments.length > 0 ? 
            user.departments[0].name?.toLowerCase().includes(query) : false),
      );
    }

    if (selectedRole.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        selectedRole.some(role => user.roles.includes(role)),
      );
    }

    if (selectedStatus.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        selectedStatus.includes(user.active),
      );
    }

    return filteredUsers;
  }, [users, filterValue, selectedRole, selectedStatus]);

  const userItems = useMemo(() => {
    const sortedItems = [...filteredItems];

    if (sortDescriptor.column && sortDescriptor.direction) {
      sortedItems.sort((a, b) => {
        const direction = sortDescriptor.column === 'ascending' ? 1 : -1;

        if (sortDescriptor.column === 'role') {
          const aRole = a.roles && a.roles.length > 0 ? a.roles[0] : '';
          const bRole = b.roles && b.roles.length > 0 ? b.roles[0] : '';
          return aRole.localeCompare(bRole) * direction;
        }
        if (sortDescriptor.column === 'status') {
          return (a.active === b.active ? 0 : a.active ? 1 : -1) * direction;
        }
        if (sortDescriptor.column === 'department') {
          const aDept = a.departments && a.departments.length > 0 ? a.departments[0].name || '' : '';
          const bDept = b.departments && b.departments.length > 0 ? b.departments[0].name || '' : '';
          return aDept.localeCompare(bDept) * direction;
        }
        if (sortDescriptor.column === 'lastLogin') {
          const aDate = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
          const bDate = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
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
    (user: User, columnKey: Key) => (
      <UserCellRenderer
        columnKey={columnKey}
        user={user}
        onDelete={onDelete}
        onEdit={onEdit}
        onView={onView}
      />
    ),
    [onEdit, onDelete, onView],
  );

  return (
    <div className="w-full flex flex-col">
      <Table
        aria-label="Users Table"
        topContent={
          <TopContent
            filterValue={filterValue}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            onClear={onClear}
            onRefresh={onRefresh || (() => {})}
            onRoleChange={onRoleChange}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
          />
        }
        topContentPlacement="outside"
        classNames={{
          wrapper: 'min-w-full overflow-visible',
          table: 'min-w-full',
          thead: 'bg-default-50 dark:bg-default-100',
          th: 'text-default-600 dark:text-default-400 font-semibold text-sm uppercase tracking-wider',
          td: 'py-3',
          tr: 'hover:bg-default-50 dark:hover:bg-default-100 transition-colors',
        }}
        sortDescriptor={sortDescriptor}
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
          emptyContent={<span className="text-default-400">No users found</span>}
          items={[...userItems]}
        >
          {(user: User) => (
            <TableRow key={user.id}>
              {columnKey => <TableCell>{renderCell(user, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination at Bottom */}
      <BottomContent
        page={page}
        pages={pages}
        setPage={setPage}
        totalUsers={userItems.length}
        currentPage={page}
      />
    </div>
  );
}
