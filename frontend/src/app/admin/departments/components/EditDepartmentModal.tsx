"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, X } from "lucide-react";
import { useDepartments } from "../hooks/use-departments";
import type { Department, CreateDepartmentRequest } from "@/app/admin/users/models/types";

interface EditDepartmentModalProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDepartmentModal({
  department,
  open,
  onOpenChange,
}: EditDepartmentModalProps) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: department.name,
    description: department.description,
  });

  const { updateDepartment, isLoading } = useDepartments();

  useEffect(() => {
    setFormData({
      name: department.name,
      description: department.description,
    });
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDepartment(department.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-violet-100 rounded-xl"
              >
                <Building2 className="h-6 w-6 text-violet-600" />
              </motion.div>
              <div>
                <DialogTitle className="text-xl">Edit Department</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Update department details
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-violet-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the department&apos;s role and responsibilities"
                className="min-h-[100px]"
                required
              />
            </div>
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
              type="submit"
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              <Building2 className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 