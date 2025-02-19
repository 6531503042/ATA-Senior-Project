
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Timer,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  startDate: string;
  endDate: string;
  teamSize: number;
  progress: number;
}

const Projects = () => {
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Employee Satisfaction Survey",
      description: "Annual employee feedback collection",
      status: "active",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      teamSize: 5,
      progress: 65,
    },
    {
      id: 2,
      name: "Performance Review Q1",
      description: "Quarterly performance evaluations",
      status: "upcoming",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      teamSize: 8,
      progress: 0,
    },
    {
      id: 3,
      name: "Leadership Assessment",
      description: "Management capability evaluation",
      status: "completed",
      startDate: "2024-01-01",
      endDate: "2024-02-01",
      teamSize: 12,
      progress: 100,
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white/90">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Projects Dashboard
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Manage and track your feedback collection projects
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-gray-500">Currently in progress</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">Upcoming Projects</h3>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-sm text-gray-500">Starting this month</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">Team Members</h3>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-sm text-gray-500">Across all projects</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-4 w-full bg-white/50 backdrop-blur-sm border-gray-200"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200/50"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium",
                          {
                            "bg-green-100 text-green-700": project.status === "active",
                            "bg-blue-100 text-blue-700": project.status === "completed",
                            "bg-amber-100 text-amber-700": project.status === "upcoming",
                          }
                        )}
                      >
                        {project.status === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {project.status === "completed" && <Clock className="h-3 w-3 mr-1" />}
                        {project.status === "upcoming" && <Timer className="h-3 w-3 mr-1" />}
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.teamSize} members</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
