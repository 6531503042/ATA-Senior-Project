import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useUsers } from "../hooks/use-users";
import { CreateDepartmentRequest } from "../models/types";

interface EditDepartmentModalProps {
  departmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDepartmentModal({ departmentId, open, onOpenChange }: EditDepartmentModalProps) {
  const { departments, updateDepartment } = useUsers();
  const [formData, setFormData] = useState<Partial<CreateDepartmentRequest>>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const department = departments?.find((d) => d.id === departmentId);
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
      });
    }
  }, [departmentId, departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDepartment({ id: departmentId, data: formData });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 