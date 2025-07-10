import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, Edit, Trash2, Lock, AlertCircle } from 'lucide-react';

// Type definitions based on API schema
interface User {
  id: number;
  username: string;
  password: string;
  role: 'ADMIN' | 'STAFF';
}

interface UserDTO extends Omit<User, 'id'> {
  id?: number;
}

// Real API endpoint
const API_BASE = 'http://localhost:8080/api/users';

// Custom API hook with proper error handling
const useUserAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T,>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Real API call configuration
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          // Add authorization if needed
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
        },
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If parsing error response fails, use the default message
        }
        throw new Error(errorMessage);
      }

      // For DELETE requests that return no content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, error, setError };
};

// API operations hook
const useUserOperations = () => {
  const { request, isLoading, error, setError } = useUserAPI();

  const getAllUsers = () => request<User[]>(API_BASE);
  
  const createUser = (user: UserDTO) => request<User>(API_BASE, 'POST', user);
  
  const getUserById = (id: number) => request<User>(`${API_BASE}/${id}`);
  
  const updateUser = (id: number, user: UserDTO) => 
    request<User>(`${API_BASE}/${id}`, 'PUT', user);
  
  const deleteUser = (id: number) => 
    request<void>(`${API_BASE}/${id}`, 'DELETE');

  const clearError = () => setError(null);

  return {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    isLoading,
    error,
    clearError
  };
};

// Form validation
const validateUser = (user: Partial<UserDTO>): string | null => {
  if (!user.username?.trim()) return 'Username is required';
  if (!user.password?.trim()) return 'Password is required';
  if (!user.role) return 'Role is required';
  if (user.username.length < 3) return 'Username must be at least 3 characters';
  if (user.password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

// User Form Component
const UserForm: React.FC<{
  user?: User;
  onSubmit: (user: UserDTO) => void;
  onCancel: () => void;
}> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<UserDTO>({
    username: user?.username || '',
    password: user?.password || '',
    role: user?.role || 'STAFF',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateUser(formData);
    if (error) {
      setValidationError(error);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={user ? "Enter new password or leave unchanged" : "Enter password"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={formData.role}
          onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'STAFF' }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
      </div>

      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          {validationError}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {user ? 'Update User' : 'Create User'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// User Table Component
const UserTable: React.FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(user)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main User Management Component
const UserManagement: React.FC = () => {
  const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
    error,
    clearError
  } = useUserOperations();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // When error is shown, auto-clear after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      // Error is already set in the hook
    }
  };

  const handleCreateUser = async (userDTO: UserDTO) => {
    try {
      await createUser(userDTO);
      await loadUsers();
      setIsFormVisible(false);
      setSuccessMessage('User created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleUpdateUser = async (userDTO: UserDTO) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, userDTO);
      await loadUsers();
      setIsFormVisible(false);
      setSelectedUser(null);
      setSuccessMessage('User updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      await loadUsers();
      setSuccessMessage('User deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and permissions - Admin access required
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsFormVisible(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* API Info Banner */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md flex items-center gap-2">
        <Lock size={16} />
        Connected to backend API at {API_BASE}
      </div>

      {/* User Form */}
      {isFormVisible && (
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {selectedUser ? 'Edit User' : 'Create New User'}
          </h2>
          <UserForm
            user={selectedUser || undefined}
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* User Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User List
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            All registered users in the system
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="mx-auto h-8 w-8 text-indigo-500 animate-spin" />
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;