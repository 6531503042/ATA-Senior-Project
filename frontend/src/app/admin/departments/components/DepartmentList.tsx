"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ChevronRight,
  ChevronDown,
  Users,
  CheckCircle2,
  X,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlertDialog } from '@/components/ui/alert-dialog';
import type { DepartmentHierarchy } from '@/app/admin/departments/models/types';
import { cn } from '@/lib/utils';

interface DepartmentListProps {
  departments: DepartmentHierarchy[];
  onEdit: (department: DepartmentHierarchy) => void;
  onDelete: (department: DepartmentHierarchy) => void;
}

export function DepartmentList({
  departments,
  onEdit,
  onDelete,
}: DepartmentListProps) {
  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <DepartmentNode
          key={department.id}
          department={department}
          onEdit={onEdit}
          onDelete={onDelete}
          level={0}
        />
      ))}
    </div>
  );
}

interface DepartmentNodeProps {
  department: DepartmentHierarchy;
  onEdit: (department: DepartmentHierarchy) => void;
  onDelete: (department: DepartmentHierarchy) => void;
  level: number;
}

function DepartmentNode({
  department,
  onEdit,
  onDelete,
  level,
}: DepartmentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { showAlert } = useAlertDialog();
  const hasChildren = department.children && department.children.length > 0;

  const handleDelete = () => {
    showAlert({
      title: 'Delete Department',
      description: `Are you sure you want to delete the ${department.name} department? This action cannot be undone.`,
      variant: 'solid',
      color: 'danger',
      icon: <Trash2 className="h-5 w-5" />,
      duration: 0, // Keep the alert visible until user action
      isLoading: false,
    });

    // Handle the delete action directly
    onDelete(department);
  };

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'group relative flex items-center gap-4 p-4 rounded-lg border border-gray-100',
          'hover:border-violet-100 hover:bg-violet-50/50 transition-colors',
          'shadow-sm hover:shadow-md'
        )}
        style={{ marginLeft: `${level * 2}rem` }}
      >
        <div
          className={cn(
            'absolute -left-px top-1/2 -translate-y-1/2 w-1 h-4/5 rounded-r-full',
            'bg-gradient-to-b from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100',
            'transition-opacity'
          )}
        />

        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 hover:bg-violet-100"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-lg',
            'bg-violet-100 text-violet-600'
          )}
        >
          <Building2 className="h-5 w-5" />
        </div>

        <div className="flex-grow">
          <h3 className="text-sm font-medium text-gray-900">{department.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {department.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {department.memberCount || 0}
            </span>
          </div>

          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full',
              department.status === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            {department.status === 'ACTIVE' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm capitalize">{department.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(department)}
              className="h-8 w-8 p-0 hover:bg-violet-100"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {department.children.map((child) => (
                <DepartmentNode
                  key={child.id}
                  department={child}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
} 