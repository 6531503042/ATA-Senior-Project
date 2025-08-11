"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  Loader2,
  Network,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/components/ui/alert-dialog";
import { DepartmentList } from "./components/DepartmentList";
import { DepartmentFormModal } from "./components/DepartmentFormModal";
import type {
  Department,
  DepartmentHierarchy,
  DepartmentMetrics,
} from "./models/types";
import type { User } from "@/types/auth";
import { DepartmentService } from "./services/department.service";
import { UserService } from "@/app/admin/users/services/user.service";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentHierarchy[]>([]);
  const [metrics, setMetrics] = useState<DepartmentMetrics>({
    totalDepartments: 0,
    activeDepartments: 0,
    departmentsByLevel: {},
    totalMembers: 0,
  });
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlertDialog();

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getDepartments();
      setDepartments(data.departments);
      setMetrics(data.metrics);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      showAlert({
        title: "Error",
        description: "Failed to fetch departments. Please try again.",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await UserService.getManagers();
      setManagers(data.users);
    } catch (error) {
      console.error("Failed to fetch managers:", error);
      showAlert({
        title: "Error",
        description: "Failed to fetch managers. Please try again.",
        variant: "solid",
        color: "danger",
      });
    }
  };

  const handleCreateDepartment = () => {
    setSelectedDepartment(undefined);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (department: Department) => {
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

      showAlert({
        title: "Success",
        description: `Department "${department.name}" has been deleted.`,
        variant: "solid",
        color: "success",
      });

      fetchDepartments(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete department:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "solid",
        color: "danger",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDepartment(undefined);
  };

  const handleModalSuccess = () => {
    fetchDepartments(); // Refresh the list
    handleModalClose();
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Departments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization&apos;s departments and hierarchies
            </p>
          </div>
          <Button
            onClick={handleCreateDepartment}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Department</span>
          </Button>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Departments
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics.totalDepartments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Departments
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics.activeDepartments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Network className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Hierarchy Levels
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.keys(metrics.departmentsByLevel).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </motion.div>
      </div>

      {/* Department List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : filteredDepartments.length > 0 ? (
        <DepartmentList
          departments={filteredDepartments}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No departments found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "No departments match your search criteria"
              : "Get started by creating a new department"}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button
                onClick={handleCreateDepartment}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Department</span>
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Department Form Modal */}
      {isModalOpen && (
        <DepartmentFormModal
          department={selectedDepartment}
          departments={departments}
          managers={managers}
          mode={selectedDepartment ? "edit" : "create"}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
