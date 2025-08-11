import usersJson from "@/data/users.json";
import type { 
  User, 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserStats 
} from "@/types/user";

// Mock API functions - ready to be replaced with real API calls
export async function getUsers(): Promise<UserResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    users: usersJson.users as User[],
    stats: usersJson.stats as UserStats,
    pagination: usersJson.pagination
  };
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: Date.now().toString(),
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    status: 'active',
    phone: data.phone,
    department: data.department,
    position: data.position,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newUser;
}

export async function updateUser(data: UpdateUserRequest): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would fetch the existing user and merge updates
  const updatedUser: User = {
    id: data.id,
    username: data.username || "updated_user",
    email: data.email || "updated@example.com",
    firstName: data.firstName || "Updated",
    lastName: data.lastName || "User",
    role: data.role || "user",
    status: data.status || "active",
    phone: data.phone,
    department: data.department,
    position: data.position,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString()
  };
  
  return updatedUser;
}

export async function deleteUser(userId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real implementation, this would call the API to delete the user
  console.log(`User ${userId} deleted`);
}

export async function getUserStats(): Promise<UserStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return usersJson.stats as UserStats;
}

// Helper function to format user role for display
export function formatUserRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// Helper function to format user status for display
export function formatUserStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Helper function to get user role color
export function getUserRoleColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'danger';
    case 'manager':
      return 'warning';
    case 'user':
      return 'primary';
    case 'guest':
      return 'default';
    default:
      return 'default';
  }
}

// Helper function to get user status color
export function getUserStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'default';
    case 'pending':
      return 'warning';
    case 'suspended':
      return 'danger';
    default:
      return 'default';
  }
}

// Helper function to get user initials
export function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Helper function to format date
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
