import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  ParkingCircle, 
  CheckCircle, 
  AlertCircle,
  Car
} from 'lucide-react';

import { useReservations } from '../../hooks/useReservation';
import { CreateReservationDTO } from '../../utils/ReservationApiClient';
import parkingApi from '../../utils/parkingApiClient';

const CreateReservation: React.FC = () => {
  const navigate = useNavigate();
  const { createReservation, error, success, loading } = useReservations();
  
  // State for the reservation form
  const [formData, setFormData] = useState<Partial<CreateReservationDTO>>({
    status: 'PENDING'
  });
  const [availableSpots, setAvailableSpots] = useState<Array<{ spotId: number, spotNumber: string, location: string }>>([]);
  const [drivers, setDrivers] = useState<Array<{ id: number, name: string }>>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Load available spots and drivers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available parking spots
        const spots = await parkingApi.getAllParkingSpots();
        const available = spots
          .filter(spot => !spot.occupied)
          .map(spot => ({
            spotId: spot.spotId,
            spotNumber: spot.spotNumber,
            location: `Level ${spot.level}, Section ${spot.section}`
          }));
        setAvailableSpots(available);
        
        // In a real app, we'd fetch drivers from an API
        // This is mock data for demonstration
        setDrivers([
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
          { id: 3, name: 'Robert Johnson' }
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.spotId) {
      errors.spotId = 'Please select a parking spot';
    }
    
    if (!formData.driverId) {
      errors.driverId = 'Please select a driver';
    }
    
    if (!formData.startTime) {
      errors.startTime = 'Please select a start time';
    }
    
    if (!formData.endTime) {
      errors.endTime = 'Please select an end time';
    } else if (formData.startTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      errors.endTime = 'End time must be after start time';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Convert string IDs to numbers
      const reservation: CreateReservationDTO = {
        ...formData as CreateReservationDTO,
        spotId: Number(formData.spotId),
        driverId: Number(formData.driverId)
      };
      
      await createReservation(reservation);
      
      // Navigate back to reservations list after successful creation
      setTimeout(() => {
        navigate('/admin/reservations');
      }, 2000);
    } catch (err) {
      console.error('Error creating reservation:', err);
    }
  };
  
  // Calculate duration between start and end time
  const calculateDuration = (): string => {
    if (!formData.startTime || !formData.endTime) {
      return 'Select start and end times';
    }
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    
    if (start >= end) {
      return 'Invalid time range';
    }
    
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/reservations')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Back to Reservations"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Create New Reservation</h2>
          <p className="text-sm text-gray-500">
            Schedule a parking spot reservation
          </p>
        </div>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Details</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Driver Selection */}
                <div>
                  <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">
                    Driver
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="driverId"
                      name="driverId"
                      value={formData.driverId || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.driverId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select a driver</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                      ))}
                    </select>
                  </div>
                  {formErrors.driverId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.driverId}</p>
                  )}
                </div>
                
                {/* Parking Spot Selection */}
                <div>
                  <label htmlFor="spotId" className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spot
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ParkingCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="spotId"
                      name="spotId"
                      value={formData.spotId || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.spotId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select a parking spot</option>
                      {availableSpots.map(spot => (
                        <option key={spot.spotId} value={spot.spotId}>
                          {spot.spotNumber} ({spot.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.spotId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.spotId}</p>
                  )}
                </div>
                
                {/* Start Time */}
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={formData.startTime || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.startTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>
                  {formErrors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.startTime}</p>
                  )}
                </div>
                
                {/* End Time */}
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={formData.endTime || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${formErrors.endTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>
                  {formErrors.endTime && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.endTime}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Clock className="animate-spin mr-2 h-5 w-5" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Create Reservation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Reservation Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Booking Details</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Driver:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.driverId ? 
                        drivers.find(d => d.id === Number(formData.driverId))?.name || '-' 
                        : '-'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Spot:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.spotId ? 
                        availableSpots.find(s => s.spotId === Number(formData.spotId))?.spotNumber || '-' 
                        : '-'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Location:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.spotId ? 
                        availableSpots.find(s => s.spotId === Number(formData.spotId))?.location || '-' 
                        : '-'}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Start:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.startTime ? new Date(formData.startTime).toLocaleString() : '-'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">End:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.endTime ? new Date(formData.endTime).toLocaleString() : '-'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Duration:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {calculateDuration()}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Status:</p>
                    <p className="text-sm font-medium">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        PENDING
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-indigo-500 mr-2" />
                  <p className="text-sm text-indigo-800">
                    Reservations are pending until confirmed by an administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;