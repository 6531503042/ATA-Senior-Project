'use client';

import { Button, Card, CardBody, CardHeader, Chip, Avatar, AvatarGroup } from "@heroui/react";
import { PlusIcon, FilterIcon, RefreshCwIcon, EditIcon, TrashIcon, CalendarIcon } from 'lucide-react';
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectsModal } from "./_components/ProjectsModal";

const mockProjects = [
  {
    id: "1",
    name: "Data Analytics Dashboard",
    description: "Creating a comprehensive dashboard for business analytics and reporting",
    timeline: {
      start: "Feb 12, 2025",
      end: "Jul 1, 2026"
    },
    status: "active",
    team: [
      { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" },
      { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=2" },
    ],
    initial: "D"
  },
  {
    id: "2", 
    name: "Cloud Migration",
    description: "Migrating existing infrastructure to cloud for better scalability and performance",
    timeline: {
      start: "Feb 12, 2025",
      end: "Jul 1, 2026"
    },
    status: "active",
    team: [
      { id: "3", name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?u=3" },
    ],
    initial: "C"
  },
  {
    id: "3",
    name: "Security Enhancement", 
    description: "Implementing advanced security measures across all systems",
    timeline: {
      start: "Feb 12, 2025",
      end: "Jul 1, 2026"
    },
    status: "active",
    team: [],
    initial: "S"
  },
  {
    id: "4",
    name: "E-Commerce Platform Redesign",
    description: "Redesigning the company's e-commerce platform to improve user experience",
    timeline: {
      start: "Feb 12, 2025", 
      end: "Jul 1, 2026"
    },
    status: "active",
    team: [
      { id: "4", name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?u=4" },
    ],
    initial: "E"
  },
  {
    id: "5",
    name: "Mobile App Development",
    description: "Developing a new mobile app for customer engagement and service delivery",
    timeline: {
      start: "Feb 12, 2025",
      end: "Jul 1, 2026"
    },
    status: "active", 
    team: [
      { id: "5", name: "Alex Brown", avatar: "https://i.pravatar.cc/150?u=5" },
      { id: "6", name: "Lisa Davis", avatar: "https://i.pravatar.cc/150?u=6" },
    ],
    initial: "M"
  }
];

const mockStats = [
  { title: "Total Projects", value: "5", icon: PlusIcon, color: "text-blue-600" },
  { title: "Active Projects", value: "5", icon: RefreshCwIcon, color: "text-green-600" },
  { title: "Completed Projects", value: "0", icon: CalendarIcon, color: "text-purple-600" },
  { title: "Total Members", value: "1", icon: FilterIcon, color: "text-orange-600" },
];

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader 
        description='Manage and track all your projects in one place' 
        icon={<PlusIcon />} 
      />
      
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-default-900">Projects</h1>
            <p className="text-default-600 mt-1">Manage and track all your projects in one place</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="bordered"
              startContent={<FilterIcon className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Filters
            </Button>
            <Button
              variant="bordered"
              startContent={<RefreshCwIcon className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
            <Button
              color="primary"
              variant="shadow"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={() => setIsModalOpen(true)}
              className="w-full sm:w-auto font-semibold"
            >
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-default-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-default-100">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Projects Table */}
        <Card className="border-none shadow-xl">
          <CardHeader className="pb-6">
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-default-500 uppercase tracking-wider">
                <div className="col-span-4">Project</div>
                <div className="col-span-3">Timeline</div>
                <div className="col-span-2">Team</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-1">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-12 gap-4 px-4 py-4 rounded-lg hover:bg-default-50 transition-colors border-b border-default-100 last:border-b-0"
                >
                  {/* Project Info */}
                  <div className="col-span-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {project.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-default-500 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="col-span-3 flex flex-col justify-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-default-600">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Start: {project.timeline.start}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-default-600">
                        <CalendarIcon className="w-3 h-3" />
                        <span>End: {project.timeline.end}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="col-span-2 flex items-center">
                    {project.team.length > 0 ? (
                      <AvatarGroup size="sm" max={3}>
                        {project.team.map((member) => (
                          <Avatar
                            key={member.id}
                            src={member.avatar}
                            name={member.name}
                            className="w-8 h-8"
                          />
                        ))}
                      </AvatarGroup>
                    ) : (
                      <span className="text-xs text-default-400">No team assigned</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      className="font-medium"
                    >
                      Active
                    </Chip>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 hover:text-blue-600"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <ProjectsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log('Project created:', data);
          setIsModalOpen(false);
        }}
        mode="create"
      />
    </>
  );
}
