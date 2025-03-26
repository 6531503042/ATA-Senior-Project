"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/app/admin/users/components/UserTable";
import { DepartmentTable } from "@/app/admin/departments/components/DepartmentTable";
import { CreateUserModal } from "@/app/admin/users/components/CreateUserModal";
import { CreateDepartmentModal } from "@/app/admin/departments/components/CreateDepartmentModal";
import { Button } from "@/components/ui/button";
import { UserCircle2, Building2 } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="space-x-4">
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentTable />
        </TabsContent>
      </Tabs>

      <CreateUserModal
        open={isCreateUserModalOpen}
        onOpenChange={setIsCreateUserModalOpen}
      />

      <CreateDepartmentModal
        open={isCreateDepartmentModalOpen}
        onOpenChange={setIsCreateDepartmentModalOpen}
      />
    </div>
  );
} 