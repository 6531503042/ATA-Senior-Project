"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Table from "@/components/ui/Table";
import { useDepartments } from "../hooks/use-departments";
import { EditDepartmentModal } from "./EditDepartmentModal";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { Search, Building2, Plus, Users } from "lucide-react";
import type { Department } from "@/app/admin/users/models/types";
import { CreateDepartmentModal } from "./CreateDepartmentModal";

const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-4 pb-4">
      <Skeleton className="h-10 w-[250px]" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);

export function DepartmentTable() {
  const { departments, isLoading, error } = useDepartments();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredDepartments = departments?.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const columns = [
    { 
      key: "name", 
      header: "Name",
      render: (department: Department) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100">
            <Building2 className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <div className="font-medium">{department.name}</div>
            <div className="text-sm text-gray-500">{department.description}</div>
          </div>
        </div>
      )
    },
    { 
      key: "memberCount", 
      header: "Members",
      render: (department: Department) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <span>{department.users.length} members</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (department: Department) => (
        <Badge
          variant={department.active ? "default" : "destructive"}
          className={`capitalize ${
            department.active
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {department.active ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  const actions = (department: Department) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditingDepartment(department)}
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setDeletingDepartment(department)}
        className="hover:bg-red-600"
      >
        Delete
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-violet-500" />
              Department Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization&apos;s departments and hierarchies
            </p>
          </div>
          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Department
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TableSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              Error loading departments. Please try again.
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-md border"
            >
              <Table
                data={filteredDepartments}
                columns={columns}
                actions={actions}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          open={!!editingDepartment}
          onOpenChange={(open: boolean) => !open && setEditingDepartment(null)}
        />
      )}

      {deletingDepartment && (
        <DeleteDepartmentDialog
          department={deletingDepartment}
          open={!!deletingDepartment}
          onOpenChange={(open: boolean) => !open && setDeletingDepartment(null)}
        />
      )}

      <CreateDepartmentModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
} 