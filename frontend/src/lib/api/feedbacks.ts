import axios from 'axios';
import { getCookie } from 'cookies-next';
import type { Feedback, CreateFeedbackDto, FeedbackFilters } from '@/app/admin/feedbacks/models/types';

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

export async function getFeedbacks(filters: Partial<FeedbackFilters> = {}) {
  try {
    const response = await feedbackApi.get('/api/v1/admin/feedbacks/get-all', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    throw error;
  }
}

export async function getFeedbackById(id: number) {
  try {
    const response = await feedbackApi.get(`/api/v1/admin/feedbacks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch feedback ${id}:`, error);
    throw error;
  }
}

export async function createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
  try {
    // Format dates if they are provided
    const feedbackData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString()
    };

    console.log('Creating feedback with data:', feedbackData);
    const response = await feedbackApi.post('/api/v1/admin/feedbacks/create', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Failed to create feedback:', error);
    throw error;
  }
}

export async function updateFeedback(id: number, data: Partial<CreateFeedbackDto>) {
  try {
    // Format dates if they are provided
    const feedbackData = {
      ...data,
      ...(data.startDate && { startDate: new Date(data.startDate).toISOString() }),
      ...(data.endDate && { endDate: new Date(data.endDate).toISOString() })
    };

    const response = await feedbackApi.put(`/api/v1/admin/feedbacks/${id}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update feedback ${id}:`, error);
    throw error;
  }
}

export async function deleteFeedback(id: number) {
  try {
    const response = await feedbackApi.delete(`/api/v1/admin/feedbacks/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete feedback ${id}:`, error);
    throw error;
  }
}

export async function toggleFeedbackStatus(id: number, active: boolean) {
  try {
    const response = await feedbackApi.patch(`/api/v1/admin/feedbacks/${id}/status`, { active });
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle feedback ${id} status:`, error);
    throw error;
  }
} 