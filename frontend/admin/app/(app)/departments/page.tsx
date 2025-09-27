'use client';

import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/department';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { PlusIcon, BuildingIcon } from 'lucide-react';

import DepartmentModal from './_components/DepartmentModal';
import DepartmentTable from './_components/DepartmentsTable';

import { PageHeader } from '@/components/ui/page-header';
import { useDepartment } from '@/hooks/useDepartment';

export default function DepartmentsPage() {
  const {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentMembers,
  } = useDepartment();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats from departments data
  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(d => d.active).length,
    inactiveDepartments: departments.filter(d => !d.active).length,
    totalEmployees: departments.reduce((sum, dept) => sum + (dept.memberCount || 0), 0),
  };

  const statsCards = [
    {
      title: 'Total Departments',
      value: stats.totalDepartments.toString(),
      description: 'All active and inactive departments',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-600 to-indigo-700',
      icon: BuildingIcon,
    },
    {
      title: 'Active Departments',
      value: stats.activeDepartments.toString(),
      description: 'Currently active departments',
      gradient: 'from-green-400 to-teal-500',
      bgColor: 'from-green-600 to-teal-700',
      icon: BuildingIcon,
    },
    {
      title: 'Inactive Departments',
      value: stats.inactiveDepartments.toString(),
      description: 'Departments currently inactive',
      gradient: 'from-red-400 to-rose-500',
      bgColor: 'from-red-600 to-rose-700',
      icon: BuildingIcon,
    },
    {
      title: 'Total Members',
      value: stats.totalEmployees.toString(),
      description: 'All members in all departments',
      gradient: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-600 to-amber-700',
      icon: BuildingIcon,
    },
  ];

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditDepartment = (dept: any) => {
    setSelectedDepartment(dept);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSubmit = async (departmentData: { name: string; description: string; active: boolean }, mode: 'create' | 'edit') => {
    try {
      let result;
      if (mode === 'create') {
        result = await createDepartment(departmentData);
      } else if (mode === 'edit' && selectedDepartment) {
        result = await updateDepartment(selectedDepartment.id, departmentData);
      }
      handleModalClose();
      return result;
    } catch (error) {
      console.error('Failed to submit department:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteDepartment(parseInt(id));
    } catch (error) {
      console.error('Failed to delete department:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  return (
    <>
      <PageHeader
        description="Manage departments and their members"
        icon={<BuildingIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 dark:border-gray-700 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-800 dark:via-purple-800 dark:to-gray-900 shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/10 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl">
              <BuildingIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Department Management</h1>
              <p className="text-white/70 dark:text-gray-300 mt-1">Manage departments and their members</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-white border-white/20 dark:border-gray-600"
              color="default"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="bordered"
              onPress={handleAddDepartment}
            >
              Add Department
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-default-500 dark:text-default-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-default-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-default-400 dark:text-default-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900 dark:text-white">
                Department List
              </h3>
              <p className="text-sm text-default-600 dark:text-default-400">
                View and manage all departments
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-default-400 dark:text-default-500">Loading departments...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500 dark:text-red-400">Error: {error}</div>
              </div>
            ) : (
              <DepartmentTable
                departments={departments.map(dept => ({
                  id: dept.id.toString(),
                  name: dept.name,
                  memberCount: dept.memberCount || 0,
                  status: dept.active ? 'active' as const : 'inactive' as const,
                  createdAt: dept.createdAt,
                  description: dept.description,
                }))}
                onDelete={handleDeleteDepartment}
                onEdit={handleEditDepartment}
                onRefresh={fetchDepartments}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <DepartmentModal
        department={selectedDepartment || undefined}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        getDepartmentMembers={getDepartmentMembers}
      />
    </>
  );
}
