import projectsJson from "@/data/projects.json";
import type { 
  Project, 
  ProjectResponse, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ProjectStats 
} from "@/types/project";

// Mock API functions - ready to be replaced with real API calls
export async function getProjects(): Promise<ProjectResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    projects: projectsJson.projects as Project[],
    stats: projectsJson.stats as ProjectStats,
    pagination: projectsJson.pagination
  };
}

export async function createProject(data: CreateProjectRequest): Promise<Project> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newProject: Project = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description,
    status: data.status,
    timeline: {
      startDate: data.startDate,
      endDate: data.endDate,
      duration: Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))
    },
    team: [], // Would be populated with actual team members
    category: data.category,
    tags: data.tags,
    client: data.client,
    location: data.location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    initial: data.name.substring(0, 1).toUpperCase()
  };
  
  return newProject;
}

export async function updateProject(data: UpdateProjectRequest): Promise<Project> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would fetch the existing project and merge updates
  const updatedProject: Project = {
    id: data.id,
    name: data.name || "Updated Project",
    description: data.description || "Updated description",
    status: data.status || "active",
    timeline: {
      startDate: data.startDate || "2025-01-01",
      endDate: data.endDate || "2025-12-31",
      duration: 365
    },
    team: [],
    category: data.category,
    tags: data.tags,
    client: data.client,
    location: data.location,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    initial: "U"
  };
  
  return updatedProject;
}

export async function deleteProject(projectId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real implementation, this would call the API to delete the project
  console.log(`Project ${projectId} deleted`);
}

export async function getProjectStats(): Promise<ProjectStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return projectsJson.stats as ProjectStats;
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to calculate duration in days
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}
