"use client";

import { useState, useEffect } from "react";
import { userService } from "@/app/admin/users/services/user.service";
import type { Department, CreateDepartmentRequest } from "@/app/admin/users/models/types";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartments = async () => {
    try {
      const response = await userService.getDepartments();
      setDepartments(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch departments"));
    } finally {
      setIsLoading(false);
    }
  };

  const createDepartment = async (data: CreateDepartmentRequest) => {
    try {
      const response = await userService.createDepartment(data);
      setDepartments((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create department"));
      throw err;
    }
  };

  const updateDepartment = async (id: number, data: Partial<CreateDepartmentRequest>) => {
    try {
      const response = await userService.updateDepartment(id, data);
      setDepartments((prev) =>
        prev.map((dept) => (dept.id === id ? response : dept))
      );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update department"));
      throw err;
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await userService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete department"));
      throw err;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    isLoading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchDepartments,
  };
} 