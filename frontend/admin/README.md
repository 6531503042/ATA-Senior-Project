# Admin Frontend - Hooks Pattern

## 📁 **โครงสร้างโปรเจค**

```
frontend/admin/
├── hooks/                    # React Hooks สำหรับ state management
│   ├── useApi.ts            # General API hook
│   ├── useUsers.ts          # User management hook
│   ├── useProjects.ts       # Project management hook
│   ├── useDepartment.ts     # Department management hook
│   └── useQuestions.ts      # Question management hook
├── types/                   # TypeScript type definitions
│   ├── user.d.ts           # User types
│   ├── project.d.ts        # Project types
│   ├── department.d.ts     # Department types
│   ├── question.d.ts       # Question types
│   └── role.d.ts           # Role types
├── utils/                   # Utility functions
│   ├── api.ts              # API request functions
│   └── storage.ts          # Local storage utilities
└── components/              # React components
    └── ui/                  # UI components
```

## 🎯 **Pattern ที่ใช้**

### **Hooks Pattern (แบบ admin-example)**

เราใช้ **Hooks Pattern** แทน Service Layer เพราะ:

✅ **ข้อดี:**
- **ใช้งานง่าย** - ไม่ต้องสร้าง service layer ที่ซับซ้อน
- **เข้าใจง่าย** - Logic อยู่ใน hook เดียว
- **ไม่ย่อยเกินไป** - เหมาะสำหรับระบบขนาดกลาง
- **React Native** - ใช้ pattern เดียวกันได้
- **Debug ง่าย** - State และ logic อยู่ในที่เดียว

❌ **ข้อเสีย:**
- อาจมี code duplication ถ้าไม่ระวัง
- Testing อาจยากกว่า service layer

## 🔧 **การใช้งาน**

### **1. API Hook**

```typescript
import { useApi } from '@/hooks/useApi';

export function MyComponent() {
  const { request, loading, error } = useApi();

  const fetchData = async () => {
    try {
      const response = await request('/users', 'GET');
      console.log(response.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### **2. Domain Hooks**

```typescript
import { useUsers } from '@/hooks/useUsers';

export function UserList() {
  const { 
    users, 
    loading, 
    error, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsers();

  const handleCreateUser = async () => {
    await createUser({
      name: { first: 'John', last: 'Doe' },
      username: 'johndoe',
      email: 'john@example.com'
    });
  };

  return (
    <div>
      {users.map(user => (
        <div key={user._id}>
          {user.name.first} {user.name.last}
        </div>
      ))}
    </div>
  );
}
```

## 📝 **API Functions**

### **apiRequest**
```typescript
import { apiRequest } from '@/utils/api';

// GET request
const users = await apiRequest<User[]>('/users', 'GET');

// POST request
const newUser = await apiRequest<User>('/users', 'POST', userData);

// PUT request
const updatedUser = await apiRequest<User>('/users/123', 'PUT', userData);

// DELETE request
await apiRequest('/users/123', 'DELETE');
```

### **apiGolangRequest**
```typescript
import { apiGolangRequest } from '@/utils/api';

// สำหรับ Golang backend
const data = await apiGolangRequest<ResponseType>('/endpoint', 'GET');
```

## 🎨 **Type Definitions**

### **User Type**
```typescript
export type User = {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last?: string;
  };
  username: string;
  role: Role | string;
  email?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
};
```

### **Project Type**
```typescript
export type Project = {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  startDate?: string;
  endDate?: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
};
```

## 🚀 **Best Practices**

### **1. Error Handling**
```typescript
const { request, loading, error } = useApi();

const fetchData = async () => {
  try {
    const response = await request('/users', 'GET');
    // Handle success
  } catch (err) {
    // Handle error
    console.error('API Error:', err);
  }
};
```

### **2. Loading States**
```typescript
export function MyComponent() {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
}
```

### **3. Toast Notifications**
```typescript
import { addToast } from '@heroui/react';

const createUser = async (userData) => {
  try {
    await apiRequest('/users', 'POST', userData);
    addToast({
      title: 'Success!',
      description: 'User created successfully',
      color: 'success'
    });
  } catch (err) {
    addToast({
      title: 'Error!',
      description: err.message,
      color: 'danger'
    });
  }
};
```

## 🔄 **Migration จาก Service Layer**

### **ก่อน (Service Layer)**
```typescript
import { UserService } from '@/services/userService';

const users = await UserService.getUsers();
const newUser = await UserService.createUser(userData);
```

### **หลัง (Hooks Pattern)**
```typescript
import { useUsers } from '@/hooks/useUsers';

const { users, createUser } = useUsers();
await createUser(userData);
```

## 📚 **การเพิ่ม Hook ใหม่**

1. **สร้าง Type**
```typescript
// types/newEntity.d.ts
export type NewEntity = {
  _id: string;
  name: string;
  // ... other fields
};
```

2. **สร้าง Hook**
```typescript
// hooks/useNewEntity.ts
import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';
import { NewEntity } from '@/types/newEntity';
import { apiRequest } from '@/utils/api';

export function useNewEntity() {
  const [entities, setEntities] = useState<NewEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    // Implementation
  };

  const createEntity = async (data: Partial<NewEntity>) => {
    // Implementation
  };

  // ... other methods

  useEffect(() => {
    fetchEntities();
  }, []);

  return {
    entities,
    loading,
    error,
    fetchEntities,
    createEntity,
    // ... other methods
  };
}
```

3. **ใช้งานใน Component**
```typescript
import { useNewEntity } from '@/hooks/useNewEntity';

export function NewEntityList() {
  const { entities, loading, createEntity } = useNewEntity();
  
  // Component logic
}
```

## 🎉 **สรุป**

โครงสร้างใหม่นี้ใช้ **Hooks Pattern** ที่:
- **ใช้งานง่าย** และ **เข้าใจง่าย**
- **ไม่ย่อยเกินไป** เหมาะสำหรับระบบขนาดกลาง
- **Debug ง่าย** และ **Maintain ง่าย**
- **Consistent** กับ admin-example pattern

ทุก hook จะมี:
- **State management** (loading, error, data)
- **CRUD operations** (create, read, update, delete)
- **Error handling** และ **Toast notifications**
- **Auto-fetch** เมื่อ component mount
