import type { User } from '@/types/user';

export const formatUserRole = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    case 'user':
      return 'User';
    case 'guest':
      return 'Guest';
    default:
      return role;
  }
};

export const formatUserStatus = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    case 'suspended':
      return 'Suspended';
    default:
      return status;
  }
};

export const getUserRoleColor = (role: User['role']) => {
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
};

export const getUserStatusColor = (status: User['status']) => {
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
};

export const formatDate = (date: string | null) => {
  if (!date) return 'Never';

  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);

      return `${days}d ago`;
    } else {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    return 'Invalid date';
  }
};

export const formatFullDate = (date: string | null) => {
  if (!date) return 'Never';

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

export const getUserInitials = (user: User) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase();
  } else if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }

  return 'U';
};

export const getUserDisplayName = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else if (user.username) {
    return user.username;
  }

  return 'Unknown User';
};

export const getUserDepartmentName = (user: User) => {
  if (user.departments && user.departments.length > 0) {
    return user.departments[0].name;
  }

  return 'No Department';
};

export const isUserActive = (user: User) => {
  return user.status === 'active';
};

export const canUserEdit = (currentUser: User, targetUser: User) => {
  // Admin can edit anyone
  if (currentUser.roles.includes('ADMIN')) {
    return true;
  }

  // Manager can edit users but not admins
  if (currentUser.roles.includes('MANAGER')) {
    return !targetUser.roles.includes('ADMIN');
  }

  // Users can only edit themselves
  return currentUser.id === targetUser.id;
};

export const canUserDelete = (currentUser: User, targetUser: User) => {
  // Admin can delete anyone except themselves
  if (currentUser.roles.includes('ADMIN')) {
    return currentUser.id !== targetUser.id;
  }

  // Manager can delete users but not admins or themselves
  if (currentUser.roles.includes('MANAGER')) {
    return (
      !targetUser.roles.includes('ADMIN') && currentUser.id !== targetUser.id
    );
  }

  // Users cannot delete anyone
  return false;
};
