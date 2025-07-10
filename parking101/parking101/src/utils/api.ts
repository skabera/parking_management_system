import { Driver } from "../pages/admin/DriverDetails";
import { DriverDTO } from "../pages/admin/NewDriver";


// API base URL
const API_BASE = 'http://localhost:8080/api';

// Get auth token from local storage
const getAuthToken = (): string => {
  return localStorage.getItem('token') || '';
};

// Generic API request function with auth
export const apiRequest = async <T,>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown,
  handleAuthError?: () => void
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    // Clear the token
    localStorage.removeItem('authToken');
    
    // Call the auth error handler if provided
    if (handleAuthError) {
      handleAuthError();
    }
    
    throw new Error('Authentication error. Please login again.');
  }
  
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
};

// Driver-specific API functions
export const driverAPI = {
  getAllDrivers: (handleAuthError?: () => void) => 
    apiRequest<Driver[]>('/drivers', 'GET', undefined, handleAuthError),
    
  getDriverById: (id: number, handleAuthError?: () => void) => 
    apiRequest<Driver>(`/drivers/${id}`, 'GET', undefined, handleAuthError),
    
  createDriver: (driver: DriverDTO, handleAuthError?: () => void) => 
    apiRequest<Driver>('/drivers', 'POST', driver, handleAuthError),
    
  updateDriver: (id: number, driver: DriverDTO, handleAuthError?: () => void) => 
    apiRequest<Driver>(`/drivers/${id}`, 'PUT', driver, handleAuthError),
    
  deleteDriver: (id: number, handleAuthError?: () => void) => 
    apiRequest<void>(`/drivers/${id}`, 'DELETE', undefined, handleAuthError),
    
  searchDrivers: (query: string, handleAuthError?: () => void) => 
    apiRequest<Driver[]>(`/drivers/search?query=${encodeURIComponent(query)}`, 'GET', undefined, handleAuthError),
    
  getDriverByLicensePlate: (plate: string, handleAuthError?: () => void) => 
    apiRequest<Driver>(`/drivers/license/${plate}`, 'GET', undefined, handleAuthError)
};