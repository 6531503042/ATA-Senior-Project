import { User, UserRole, UserStatus } from "@/types/user";
import { SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Key, useCallback, useMemo, useState } from "react";
import UserCellRenderer from "./UserCellRenderer";
import TopContent from "./TopContent";
import BottomContent from "./BottomContent";

const COLUMNS = [
  { name: "USER", uid: "user", allowsSorting: false },
  { name: "ROLE", uid: "role", allowsSorting: true },
  { name: "STATUS", uid: "status", allowsSorting: true },
  { name: "DEPARTMENT", uid: "department", allowsSorting: true },
  { name: "LAST LOGIN", uid: "lastLogin", allowsSorting: true },
  { name: "ACTIONS", uid: "actions", allowsSorting: false },
];

type UserTableProps = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onView?: (user: User) => void;
  onRefresh?: () => void;
};

export default function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onView,
  onRefresh 
}: UserTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "user",
    direction: "ascending"
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSearch = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const handleClear = () => {
    setFilterValue("");
    setPage(1);
  };

  const handleRoleChange = (role: UserRole[]) => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleStatusChange = (status: UserStatus[]) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(users ?? [])];
    const query = filterValue.toLowerCase();

    if (!!filterValue) {
      filteredUsers = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department?.toLowerCase().includes(query)
      );
    }

    if (selectedRole.length > 0) {
      filteredUsers = filteredUsers.filter(user => selectedRole.includes(user.role));
    }

    if (selectedStatus.length > 0) {
      filteredUsers = filteredUsers.filter(user => selectedStatus.includes(user.status));
    }

    return filteredUsers;
  }, [users, filterValue, selectedRole, selectedStatus]);

  const userItems = useMemo(() => {
    const sortedItems = [...filteredItems];

    if (sortDescriptor.column && sortDescriptor.direction) {
      sortedItems.sort((a, b) => {
        const direction = sortDescriptor.direction === "ascending" ? 1 : -1;

        if (sortDescriptor.column === "role") return a.role.localeCompare(b.role) * direction;
        if (sortDescriptor.column === "status") return a.status.localeCompare(b.status) * direction;
        if (sortDescriptor.column === "department") {
          const aDept = a.department || ''; const bDept = b.department || '';
          return aDept.localeCompare(bDept) * direction;
        }
        if (sortDescriptor.column === "lastLogin") {
          const aDate = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const bDate = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
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
        user={user}
        columnKey={columnKey}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
    [onEdit, onDelete, onView]
  );

  return (
    <Table
      aria-label="Users Table"
      topContent={
        <TopContent
          filterValue={filterValue}
          onClear={handleClear}
          onSearchChange={handleSearch}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onRefresh={onRefresh || (() => {})}
        />
      }
      topContentPlacement="outside"
    >
      <TableHeader columns={COLUMNS}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowsSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={<span className="text-default-400">No users found</span>} items={[...userItems]}>
        {(user: User) => (
          <TableRow key={user.id}>
            {(columnKey) => (
              <TableCell>{renderCell(user, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
