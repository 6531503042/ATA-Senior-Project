"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserCircle2, 
  Building2, 
  Mail, 
  Lock, 
  Shield, 
  Users2
} from "lucide-react";
import { useUsers } from "@/app/admin/users/hooks/use-users";
import type { CreateUserRequest, Role } from "@/app/admin/users/models/types";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const { createUser, departments } = useUsers();
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    fullname: "",
    email: "",
    password: "",
    gender: "MALE",
    departmentId: undefined,
    roles: ["ROLE_USER"]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      onOpenChange(false);
      setFormData({
        username: "",
        fullname: "",
        email: "",
        password: "",
        gender: "MALE",
        departmentId: undefined,
        roles: ["ROLE_USER"]
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white shadow-2xl rounded-xl border-2 border-violet-100">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-violet-100 rounded-xl"
              >
                <UserCircle2 className="h-7 w-7 text-violet-600" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-800">Create User</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new user to your organization
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <UserCircle2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="johndoe"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Users2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="fullname"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="John Doe"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter secure password"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Work Information</h3>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700">Department</Label>
                <Select
                  value={formData.departmentId?.toString()}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    departmentId: value ? parseInt(value) : undefined 
                  })}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{dept.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "MALE" | "FEMALE" | "OTHER") => 
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MANAGER'] as Role[]).map((role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={formData.roles.includes(role) ? 'default' : 'outline'}
                      size="sm"
                      className={`gap-2 transition-all duration-300 ${
                        formData.roles.includes(role)
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : 'text-gray-600 border-gray-300 hover:bg-violet-50 hover:border-violet-300'
                      }`}
                      onClick={() => setFormData({ ...formData, roles: [role] })}
                    >
                      <Shield className="h-4 w-4" />
                      {role.replace('ROLE_', '').toLowerCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 transition-all duration-300"
            >
              <UserCircle2 className="h-5 w-5" />
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}