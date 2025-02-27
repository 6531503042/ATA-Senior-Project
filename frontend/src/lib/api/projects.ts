import axios from 'axios';
import { getCookie } from 'cookies-next';
import type { ProjectStats, CreateProjectDto, ProjectMembersDto } from '@/app/admin/projects/models/types';

// Create axios instance for feedback service
const feedbackApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FEEDBACK_API_URL || 'http://localhost:8084',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor
feedbackApi.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details
    console.log('Feedback API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer ****' : 'None'
      }
    });

    return config;
  },
  (error) => {
    console.error('Request configuration error:', error.message);
    return Promise.reject(error);
  }
);

interface ProjectFilters {
  search?: string;
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export async function getProjectMetrics(): Promise<ProjectStats> {
  try {
    const response = await feedbackApi.get('/api/v1/dashboard/projects/metrics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project metrics:', error);
    throw error;
  }
}

export async function getProjectStats(): Promise<ProjectStats> {
  return getProjectMetrics(); // Use the same endpoint for both functions
}

export async function getProjects(filters: Partial<ProjectFilters> = {}) {
  try {
    const response = await feedbackApi.get('/api/v1/admin/projects/all', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
}

export async function getProjectById(id: number) {
  try {
    const response = await feedbackApi.get(`/api/v1/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    throw error;
  }
}

export async function createProject(data: CreateProjectDto) {
  try {
    // Ensure dates are in the correct format
    const projectData = {
      ...data,
      projectStartDate: new Date(data.projectStartDate).toISOString(),
      projectEndDate: new Date(data.projectEndDate).toISOString()
    };

    console.log('Creating project with data:', projectData);
    const response = await feedbackApi.post('/api/v1/admin/projects/create', projectData);
    return response.data;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}

export async function updateProject(id: number, data: Partial<CreateProjectDto>) {
  try {
    // Format dates if they are provided
    const projectData = {
      ...data,
      ...(data.projectStartDate && { projectStartDate: new Date(data.projectStartDate).toISOString() }),
      ...(data.projectEndDate && { projectEndDate: new Date(data.projectEndDate).toISOString() })
    };

    const response = await feedbackApi.put(`/api/v1/admin/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    throw error;
  }
}

export async function deleteProject(id: number) {
  try {
    const response = await feedbackApi.delete(`/api/v1/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    throw error;
  }
}

export async function getProjectMembers(id: number) {
  try {
    const response = await feedbackApi.get(`/api/v1/admin/projects/${id}/members`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch project members for project ${id}:`, error);
    throw error;
  }
}

export async function addProjectMembers(projectId: number, memberIds: number[]) {
  try {
    const data: ProjectMembersDto = { memberIds };
    const response = await feedbackApi.post(`/api/v1/admin/projects/${projectId}/members`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to add members to project ${projectId}:`, error);
    throw error;
  }
}

export async function updateProjectMembers(projectId: number, memberIds: number[]) {
  try {
    const data: ProjectMembersDto = { memberIds };
    const response = await feedbackApi.post(`/api/v1/admin/projects/${projectId}/members`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update project ${projectId} members:`, error);
    throw error;
  }
}

export async function removeProjectMember(projectId: number, memberId: number) {
  try {
    await feedbackApi.delete(`/api/v1/admin/projects/${projectId}/members/${memberId}`);
  } catch (error) {
    console.error(`Failed to remove member ${memberId} from project ${projectId}:`, error);
    throw error;
  }
} 