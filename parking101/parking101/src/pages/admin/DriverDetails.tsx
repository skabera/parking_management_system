import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Car, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Clock
} from 'lucide-react';

// Driver interface
export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licensePlate: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  registrationDate: string;
}

// API base URL
const API_BASE = 'http://localhost:8080/api/drivers';

// Helper function to get the auth token
const getAuthToken = (): string => {
  return localStorage.getItem('token') || '';
};

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDriverDetails(parseInt(id));
    }
  }, [id]);

  const fetchDriverDetails = async (driverId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      // Check if token exists
      if (!token) {
        // Redirect to login page if token doesn't exist
        navigate('/auth/login', { state: { from: `/admin/drivers/${driverId}` } });
        return;
      }
      
      const response = await fetch(`${API_BASE}/${driverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      
      // Handle unauthorized response
      if (response.status === 401 || response.status === 403) {
        // Clear the invalid token
        localStorage.removeItem('authToken');
        // Redirect to login page
        navigate('/auth/login', { state: { from: `/admin/drivers/${driverId}` } });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error fetching driver details: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDriver(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Failed to fetch driver details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!driver) return;
    
    if (!window.confirm(`Are you sure you want to delete ${driver.firstName} ${driver.lastName}?`)) {
      return;
    }
    
    try {
      const token = getAuthToken();
      
      // Check if token exists
      if (!token) {
        navigate('/auth/login', { state: { from: `/admin/drivers/${driver.id}` } });
        return;
      }
      
      const response = await fetch(`${API_BASE}/${driver.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      
      // Handle unauthorized response
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        navigate('/auth/login', { state: { from: `/admin/drivers/${driver.id}` } });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error deleting driver: ${response.statusText}`);
      }
      
      setSuccessMessage('Driver successfully deleted');
      setTimeout(() => {
        navigate('/admin/drivers');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Failed to delete driver:', err);
    }
  };

  const handleEdit = () => {
    if (driver) {
      navigate(`/admin/drivers/edit/${driver.id}`);
    }
  };

  const handleBack = () => {
    navigate('/admin/drivers');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Driver Details</h2>
            {!loading && driver && (
              <p className="text-sm text-gray-500">
                {driver.firstName} {driver.lastName} (ID: {driver.id})
              </p>
            )}
          </div>
        </div>
        {!loading && driver && (
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Driver
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Driver
            </button>
          </div>
        )}
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
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle size={16} />
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="ml-2 text-gray-500">Loading driver details...</p>
        </div>
      ) : driver ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header with status badge */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <Car className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {driver.firstName} {driver.lastName}
                </h3>
                <p className="text-sm text-gray-500">License #{driver.licenseNumber}</p>
              </div>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
              driver.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
              driver.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {driver.status}
            </span>
          </div>
          
          {/* Driver details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">{driver.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Registration Date</p>
                    <p className="text-sm text-gray-500">{formatDate(driver.registrationDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Vehicle Information</h4>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">License Number</p>
                    <p className="text-sm text-gray-500">{driver.licenseNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Car className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">License Plate</p>
                    <p className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block">
                      {driver.licensePlate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status Updated</p>
                    <p className="text-sm text-gray-500">
                      {/* This would require additional data from your API */}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Section (optional) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Recent Activity</h4>
              <p className="text-sm text-gray-500 italic">No recent activity to display</p>
              
              {/* Uncomment this section when you have activity data
              <div className="space-y-4">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">Parking reservation created</p>
                    <p className="text-xs text-gray-500">May 5, 2025 at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">Driver information updated</p>
                    <p className="text-xs text-gray-500">April 28, 2025 at 11:15 AM</p>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="ml-2 text-gray-500">Driver not found</p>
        </div>
      )}
    </div>
  );
};

export default DriverDetails;