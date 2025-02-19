import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircleIcon,
  EllipsisHorizontalIcon,
  RocketLaunchIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Progress } from "@/components/ui/progress";

const priorityColors = {
  high: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
  medium: "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200",
  low: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
};

const statusColors = {
  active: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200",
  completed: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
  delayed: "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
};

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesigning the company website with modern UI/UX",
    status: "active",
    priority: "high",
    members: 8,
    progress: 65,
    dueDate: "2024-03-15",
    tasks: { completed: 24, total: 36 },
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Creating a new mobile app for customer engagement",
    status: "delayed",
    priority: "medium",
    members: 12,
    progress: 25,
    dueDate: "2024-04-30",
    tasks: { completed: 12, total: 48 },
  },
  // Add more sample projects as needed
];

const ProjectManage = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
            <p className="text-gray-500 max-w-2xl">
              Track and manage your organization's projects, teams, and deadlines efficiently.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </Button>
            <CreateProjectDialog />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Projects
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <RocketLaunchIcon className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-green-600 font-medium">+2</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Currently in progress
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Team Members
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                <UserGroupIcon className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">48</div>
                <div className="text-sm text-green-600 font-medium">+5</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Across all projects
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed Tasks
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm text-green-600 font-medium">+23</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                This month
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Progress
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <ChartBarIcon className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">72%</div>
                <div className="text-sm text-green-600 font-medium">+8%</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Completion rate
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
          <CardHeader className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Projects Overview</CardTitle>
                <CardDescription>
                  Monitor and manage all your ongoing projects
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <FunnelIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>Project Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="group hover:bg-gray-50/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">
                            {project.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColors[project.status as keyof typeof statusColors]
                          } inline-flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-sm`}
                        >
                          {project.status === "active" && <RocketLaunchIcon className="h-4 w-4" />}
                          {project.status === "completed" && <CheckCircleIcon className="h-4 w-4" />}
                          {project.status === "delayed" && <ClockIcon className="h-4 w-4" />}
                          {project.status === "cancelled" && <XCircleIcon className="h-4 w-4" />}
                          <span className="capitalize">{project.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            priorityColors[project.priority as keyof typeof priorityColors]
                          } inline-flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-sm`}
                        >
                          <span className="capitalize">{project.priority}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {project.tasks.completed} of {project.tasks.total} tasks completed
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium"
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                          {project.members > 3 && (
                            <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                              +{project.members - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          {project.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <EllipsisHorizontalIcon className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <ChartBarIcon className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <PencilSquareIcon className="h-4 w-4" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <TrashIcon className="h-4 w-4" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectManage;
