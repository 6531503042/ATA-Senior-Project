"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, X } from "lucide-react";
import { useDepartments } from "../hooks/use-departments";
import type { Department } from "@/app/admin/users/models/types";

interface DeleteDepartmentDialogProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartmentDialogProps) {
  const { deleteDepartment, isLoading } = useDepartments();

  const handleDelete = async () => {
    try {
      await deleteDepartment(department.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Building2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Delete Department</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6">
          <p className="text-gray-600">
            Are you sure you want to delete the department &quot;
            {department.name}&quot;?
            {department.users.length > 0 && (
              <span className="text-red-600 font-medium">
                {` This department has ${department.users.length} member${department.users.length === 1 ? "" : "s"}.`}
              </span>
            )}
          </p>
          {department.users.length > 0 && (
            <p className="mt-2 text-sm text-red-600">
              Please reassign all members to other departments before deleting.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || department.users.length > 0}
            className="gap-2"
          >
            <Building2 className="h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete Department"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
