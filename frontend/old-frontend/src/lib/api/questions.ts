import axios from "axios";
import { getCookie } from "cookies-next";
import type {
  Question,
  CreateQuestionDto,
} from "@/app/admin/questions/models/types";

// Create axios instance for questions service
const questionsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FEEDBACK_API_URL || "http://localhost:8084",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor
questionsApi.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details for debugging
    console.log("Questions API Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? "Bearer ****" : "None",
      },
    });

    return config;
  },
  (error) => {
    console.error("Request configuration error:", error.message);
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
questionsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          data: error.config.data,
        },
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Request Error:", {
        request: error.request,
        config: error.config,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export interface QuestionMetrics {
  totalQuestions: number;
  questionsByCategory: Record<string, number>;
  questionsByType: Record<string, number>;
}

export interface QuestionCategories {
  [key: string]: number;
}

export interface QuestionResponse {
  questionId: number;
  text: string;
  responseCount: number;
}

export interface QuestionResponses {
  [key: string]: QuestionResponse;
}

export async function getAllQuestions(): Promise<Question[]> {
  try {
    const response = await questionsApi.get("/api/v1/admin/questions/get-all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error;
  }
}

export async function createQuestion(
  data: CreateQuestionDto,
): Promise<Question> {
  try {
    // Log the request data for debugging
    console.log("Creating question with data:", {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      choices: data.choices?.map((choice) => choice.trim()),
    });

    const response = await questionsApi.post("/api/v1/admin/questions/create", {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      choices: data.choices?.map((choice) => choice.trim()),
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create question:", error);
    throw error;
  }
}

export async function updateQuestion(
  id: number,
  data: CreateQuestionDto,
): Promise<Question> {
  try {
    console.log("Updating question with data:", {
      id,
      ...data,
      title: data.title.trim(),
    });

    const response = await questionsApi.put(
      `/api/v1/admin/questions/update/${id}`,
      {
        title: data.title.trim(),
        description: data.description.trim(),
        questionType: data.questionType,
        category: data.category,
        choices: data.choices || [],
        required: data.required ?? true,
        validationRules: data.validationRules || "",
      },
    );

    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Update Question Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestData: {
          id,
          ...data,
          title: data.title.trim(),
        },
      });
    } else {
      console.error("Unexpected error during question update:", error);
    }
    throw error;
  }
}

export async function deleteQuestion(id: number): Promise<void> {
  try {
    await questionsApi.delete(`/api/v1/admin/questions/delete/${id}`);
  } catch (error) {
    console.error(`Failed to delete question ${id}:`, error);
    throw error;
  }
}

export async function getQuestionMetrics(): Promise<QuestionMetrics> {
  try {
    const response = await questionsApi.get(
      "/api/v1/dashboard/questions/overview",
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question metrics:", error);
    throw error;
  }
}

export async function getQuestionCategories(): Promise<QuestionCategories> {
  try {
    const response = await questionsApi.get(
      "/api/v1/dashboard/questions/categories",
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question categories:", error);
    throw error;
  }
}

export async function getQuestionResponses(): Promise<QuestionResponses> {
  try {
    const response = await questionsApi.get(
      "/api/v1/dashboard/questions/responses",
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question responses:", error);
    throw error;
  }
}
