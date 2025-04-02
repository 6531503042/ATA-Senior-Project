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
import { Building2, Loader2 } from "lucide-react";
import { useDepartments } from "../hooks/use-departments";
import type { Department, UpdateDepartmentRequest } from "../models/types";

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
  const { updateDepartment } = useDepartments();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateDepartmentRequest>({
    name: department.name,
    description: department.description,
    active: department.active,
  });

  useEffect(() => {
    setFormData({
      name: department.name,
      description: department.description,
      active: department.active,
    });
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDepartment(department.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white shadow-2xl rounded-xl border-2 border-violet-100">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-violet-100 rounded-xl"
              >
                <Building2 className="h-7 w-7 text-violet-600" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-800">Edit Department</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Update department information
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Department Name</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter department name"
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Department Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a brief description"
                className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Status</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.active ? 'default' : 'outline'}
                  className={`flex-1 ${
                    formData.active
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'text-gray-600 border-gray-300 hover:bg-violet-50 hover:border-violet-300'
                  }`}
                  onClick={() => setFormData({ ...formData, active: true })}
                >
                  Active
                </Button>
                <Button
                  type="button"
                  variant={!formData.active ? 'default' : 'outline'}
                  className={`flex-1 ${
                    !formData.active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'text-gray-600 border-gray-300 hover:bg-red-50 hover:border-red-300'
                  }`}
                  onClick={() => setFormData({ ...formData, active: false })}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Building2 className="h-5 w-5" />
                  <span>Update Department</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 