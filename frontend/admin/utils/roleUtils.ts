/**
 * Role-based access control utilities
 */

export type UserRole = 'admin' | 'super_admin' | 'user' | 'moderator';

export const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin'];
export const USER_ROLES: UserRole[] = ['user', 'moderator'];

/**
 * Check if user has admin privileges
 */
export function isAdmin(userRoles: string[] | string | undefined): boolean {
  if (!userRoles) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.some(role => ADMIN_ROLES.includes(role.toLowerCase() as UserRole));
}

/**
 * Check if user has specific role
 */
export function hasRole(userRoles: string[] | string | undefined, targetRole: UserRole): boolean {
  if (!userRoles) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.some(role => role.toLowerCase() === targetRole.toLowerCase());
}

/**
 * Get user's primary role (highest privilege)
 */
export function getPrimaryRole(userRoles: string[] | string | undefined): UserRole {
  if (!userRoles) return 'user';
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  const normalizedRoles = roles.map(role => role.toLowerCase() as UserRole);
  
  // Priority order: super_admin > admin > moderator > user
  if (normalizedRoles.includes('super_admin')) return 'super_admin';
  if (normalizedRoles.includes('admin')) return 'admin';
  if (normalizedRoles.includes('moderator')) return 'moderator';
  
  return 'user';
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(userRoles: string[] | string | undefined): boolean {
  return isAdmin(userRoles);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    'super_admin': 'Super Admin',
    'admin': 'Administrator',
    'moderator': 'Moderator',
    'user': 'User'
  };
  
  return roleNames[role] || 'User';
}

/**
 * Get role color for UI
 */
export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    'super_admin': 'danger',
    'admin': 'primary',
    'moderator': 'secondary',
    'user': 'default'
  };
  
  return roleColors[role] || 'default';
}


