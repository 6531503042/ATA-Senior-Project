import { useState } from "react";
import { motion } from "framer-motion";
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
import { useUsers } from "@/app/admin/users/hooks/use-users";
import { CreateDepartmentRequest } from "@/app/admin/users/models/types";
import { Building2 } from "lucide-react";

interface CreateDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDepartmentModal({
  open,
  onOpenChange,
}: CreateDepartmentModalProps) {
  const { createDepartment } = useUsers();
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDepartment(formData);
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-2xl rounded-xl border-2 border-violet-100">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
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
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  Create New Department
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new department to your organization
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Department Name
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter department name"
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Department Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide a brief description"
                className="bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 transition-all duration-300"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 transition-all duration-300"
            >
              <Building2 className="h-5 w-5" />
              Create Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
