import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  PlusCircle,
} from "lucide-react";
import { useUsers } from "../hooks/use-users";
import { EditDepartmentModal } from "@/app/admin/users/components/EditDepartmentModal";
import { DeleteDepartmentModal } from "@/app/admin/users/components/DeleteDepartmentModal";
import { CreateDepartmentModal } from "@/app/admin/users/components/CreateDepartmentModal";
import type { Department } from "../models/types";

export function DepartmentTable() {
  const {
    departments = [],
    isLoadingDepartments,
    deleteDepartment,
  } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<string | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] = useState<string | null>(
    null,
  );
  const [createDepartmentModalOpen, setCreateDepartmentModalOpen] =
    useState(false);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Department | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sorting function
  const sortedDepartments = [...(departments || [])].sort((a, b) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA == null || valueB == null) return 0;

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  // Filtering function
  const filteredDepartments = sortedDepartments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle sorting
  const handleSort = (column: keyof Department) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (isLoadingDepartments) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-violet-600 animate-pulse" />
          <span className="text-gray-600">Loading departments...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-white rounded-xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4 w-full max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="text-gray-600 hover:bg-violet-50"
            onClick={() => {
              /* Future filter logic */
            }}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={() => setCreateDepartmentModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Create Department
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
              { key: "employeeCount", label: "Employee Count" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ].map((column) => (
              <TableHead
                key={column.key}
                className={`cursor-pointer ${column.key !== "actions" ? "hover:bg-gray-100" : ""}`}
                onClick={() =>
                  column.key !== "actions" &&
                  handleSort(column.key as keyof Department)
                }
              >
                <div className="flex items-center">
                  {column.label}
                  {sortColumn === column.key && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-2"
                    >
                      {sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4 text-gray-500" />
                      ) : (
                        <SortDesc className="h-4 w-4 text-gray-500" />
                      )}
                    </motion.span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDepartments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No departments found
              </TableCell>
            </TableRow>
          ) : (
            filteredDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.employeeCount || 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      department.status === "active" ? "default" : "destructive"
                    }
                  >
                    {department.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDepartment(department.id)}
                      className="hover:bg-violet-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingDepartment(department.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modals */}
      {editingDepartment && (
        <EditDepartmentModal
          departmentId={editingDepartment}
          open={!!editingDepartment}
          onOpenChange={(open: boolean) => !open && setEditingDepartment(null)}
        />
      )}

      {deletingDepartment && (
        <DeleteDepartmentModal
          departmentId={deletingDepartment}
          open={!!deletingDepartment}
          onOpenChange={(open: boolean) => !open && setDeletingDepartment(null)}
          onConfirm={() => {
            deleteDepartment(deletingDepartment);
            setDeletingDepartment(null);
          }}
        />
      )}

      {createDepartmentModalOpen && (
        <CreateDepartmentModal
          open={createDepartmentModalOpen}
          onOpenChange={setCreateDepartmentModalOpen}
        />
      )}
    </motion.div>
  );
}
