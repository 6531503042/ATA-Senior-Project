"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/components/ui/alert-dialog";
import { FormField } from "@/components/ui/form-field";
import { useFormValidation } from "@/hooks/use-form-validation";
import { motion } from "framer-motion";
import {
  Building2,
  X,
  PencilIcon,
  Loader2,
  Users,
  Network,
  CheckCircle2,
} from "lucide-react";
import type { Department, CreateDepartmentDto } from "../models/types";
import type { User } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentService } from "@/app/admin/departments/services/department.service";

interface DepartmentFormModalProps {
  department?: Department;
  onClose: () => void;
  onSuccess?: () => void;
  mode: "create" | "edit";
  departments: Department[];
  managers: User[];
}

export function DepartmentFormModal({
  department,
  onClose,
  onSuccess,
  mode,
  departments,
  managers,
}: DepartmentFormModalProps) {
  const { showAlert } = useAlertDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: department?.name || "",
    description: department?.description || "",
    managerId: department?.managerId,
    parentDepartmentId: department?.parentDepartmentId,
    status: department?.status || "ACTIVE",
  });

  const validationRules = {
    name: {
      required: true,
      minLength: 3,
      message: "Department name must be at least 3 characters",
    },
    description: {
      required: true,
      minLength: 10,
      message: "Description must be at least 10 characters",
    },
  };

  const { validateForm, getFieldProps } = useFormValidation(validationRules);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
        await DepartmentService.createDepartment(formData);
      } else if (department) {
        await DepartmentService.updateDepartment(department.id, formData);
      }

      showAlert({
        title: "Success",
        description: `Department ${mode === "create" ? "created" : "updated"} successfully.`,
        variant: "solid",
        color: "success",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} department:`, error);
      showAlert({
        title: "Error",
        description: `Failed to ${mode} department. Please try again.`,
        variant: "solid",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl mx-auto"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="p-6 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-2 bg-violet-100 rounded-xl"
                  >
                    {mode === "create" ? (
                      <Building2 className="h-6 w-6 text-violet-600" />
                    ) : (
                      <PencilIcon className="h-6 w-6 text-violet-600" />
                    )}
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-xl font-semibold text-gray-900"
                    >
                      {mode === "create"
                        ? "Create Department"
                        : "Edit Department"}
                    </motion.h2>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-sm text-gray-500"
                    >
                      {mode === "create"
                        ? "Create a new department in your organization"
                        : "Update department details"}
                    </motion.p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-violet-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <div className="max-h-[calc(90vh-16rem)] overflow-y-auto">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    label="Department Name"
                    required
                    {...getFieldProps("name")}
                    helpText="Enter a unique department name"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="e.g., Human Resources"
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    required
                    {...getFieldProps("description")}
                    helpText="Provide a detailed department description"
                  >
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="Describe the department's role and responsibilities"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      label="Department Manager"
                      helpText="Select a manager for this department"
                    >
                      <Select
                        value={formData.managerId?.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            managerId: value ? parseInt(value) : undefined,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {managers.map((manager) => (
                            <SelectItem
                              key={manager.id}
                              value={manager.id.toString()}
                              className="flex items-center gap-2"
                            >
                              <Users className="h-4 w-4" />
                              <span>{manager.fullname}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField
                      label="Parent Department"
                      helpText="Optional: Select a parent department"
                    >
                      <Select
                        value={formData.parentDepartmentId?.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            parentDepartmentId: value
                              ? parseInt(value)
                              : undefined,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select parent department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter((d) => d.id !== department?.id)
                            .map((dept) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                                className="flex items-center gap-2"
                              >
                                <Network className="h-4 w-4" />
                                <span>{dept.name}</span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Status">
                    <Select
                      value={formData.status}
                      onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="ACTIVE"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Active</span>
                        </SelectItem>
                        <SelectItem
                          value="INACTIVE"
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                          <span>Inactive</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </form>
              </CardContent>
            </div>

            <CardFooter className="flex justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-violet-50/50 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="hover:bg-violet-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>
                      {mode === "create"
                        ? "Create Department"
                        : "Update Department"}
                    </span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
