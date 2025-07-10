import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  ParkingCircle, 
  CheckCircle, 
  AlertCircle,
  Car,
  FileEdit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useReservations } from '../../hooks/useReservation';
import reservationsApi, { Reservation } from '../../utils/ReservationApiClient';

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateReservationStatus, cancelReservation, error, success, loading } = useReservations();
  
  // State for the reservation
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loadingReservation, setLoadingReservation] = useState<boolean>(true);
  const [actionsOpen, setActionsOpen] = useState<boolean>(false);
  
  // Fetch reservation details
  useEffect(() => {
    const fetchReservation = async () => {
      setLoadingReservation(true);
      
      try {
        if (!id) return;
        
        const data = await reservationsApi.getReservation(parseInt(id));
        setReservation(data);
      } catch (err) {
        console.error('Error fetching reservation:', err);
      } finally {
        setLoadingReservation(false);
      }
    };
    
    fetchReservation();
  }, [id]);
  
  // Format date
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };
  
  // Calculate duration between start and end time
  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (status: string) => {
    if (!reservation) return;
    
    try {
      await updateReservationStatus(reservation.id, status);
      setReservation(prev => prev ? { ...prev, status: status as Reservation['status'] } : null);
      setActionsOpen(false);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  
  // Handle reservation cancellation
  const handleCancelReservation = async () => {
    if (!reservation) return;
    
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(reservation.id);
        setReservation(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
        setActionsOpen(false);
      } catch (err) {
        console.error('Error cancelling reservation:', err);
      }
    }
  };
  
  // Check if status update is allowed
  const isStatusUpdateAllowed = (currentStatus: string, newStatus: string): boolean => {
    // Define allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
      'PENDING': ['SCHEDULED', 'CANCELLED'],
      'SCHEDULED': ['ACTIVE', 'CANCELLED'],
      'ACTIVE': ['COMPLETED', 'CANCELLED']
    };
    
    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
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
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-800">
            Reservation Details
            {reservation && (
              <span className="ml-2 text-gray-500">#{reservation.id}</span>
            )}
          </h2>
          <p className="text-sm text-gray-500">
            View and manage reservation
          </p>
        </div>
        
        {/* Actions Menu */}
        {reservation && reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED' && (
          <div className="relative">
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Actions"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            
            {actionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <ul className="py-1">
                  {/* Edit Option */}
                  <li>
                    <button
                      onClick={() => navigate(`/admin/reservations/${reservation.id}/edit`)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit Reservation
                    </button>
                  </li>
                  
                  {/* Status Update Options */}
                  {isStatusUpdateAllowed(reservation.status, 'SCHEDULED') && (
                    <li>
                      <button
                        onClick={() => handleStatusUpdate('SCHEDULED')}
                        className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Mark as Scheduled
                      </button>
                    </li>
                  )}
                  
                  {isStatusUpdateAllowed(reservation.status, 'ACTIVE') && (
                    <li>
                      <button
                        onClick={() => handleStatusUpdate('ACTIVE')}
                        className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Active
                      </button>
                    </li>
                  )}
                  
                  {isStatusUpdateAllowed(reservation.status, 'COMPLETED') && (
                    <li>
                      <button
                        onClick={() => handleStatusUpdate('COMPLETED')}
                        className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </button>
                    </li>
                  )}
                  
                  {/* Cancel Option */}
                  {reservation.status as string !== 'CANCELLED' && (
                    <li>
                      <button
                        onClick={handleCancelReservation}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Reservation
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
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
      
      {/* Loading State */}
      {loadingReservation ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-center items-center h-64">
          <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="ml-2 text-gray-500">Loading reservation details...</p>
        </div>
      ) : reservation ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reservation Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reservation Information</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h4>
                    
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Reservation ID:</span>
                        <span className="text-sm font-medium text-gray-900">#{reservation.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Created:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDateTime(reservation.createdAt)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Updated:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDateTime(reservation.updatedAt)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {calculateDuration(reservation.startTime, reservation.endTime)}
                        </span>
                      </div>
                      
                      {reservation.totalPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${reservation.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Time Information</h4>
                    
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Schedule</span>
                      </div>
                      
                      <div className="pl-7 space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 block">Start Time:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDateTime(reservation.startTime)}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">End Time:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDateTime(reservation.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Driver and Spot Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Driver Information</h4>
                    
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{reservation.driverName}</span>
                      </div>
                      
                      <div className="pl-7 space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 block">Driver ID:</span>
                          <span className="text-sm font-medium text-gray-900">{reservation.driverId}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">License Plate:</span>
                          <span className="text-sm font-medium text-gray-900">{reservation.licensePlate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Parking Spot</h4>
                    
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex items-center">
                        <ParkingCircle className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Spot {reservation.spotNumber}</span>
                      </div>
                      
                      <div className="pl-7 space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 block">Spot ID:</span>
                          <span className="text-sm font-medium text-gray-900">{reservation.spotId}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/admin/parking-system/spots/${reservation.spotId}`)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <Car className="h-4 w-4 mr-1" />
                          View Parking Spot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Timeline</h3>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Created Status */}
                <div className="relative pl-10 pb-8">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Reservation Created</h4>
                    <p className="text-xs text-gray-500 mt-1">{formatDateTime(reservation.createdAt)}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Reservation was created with status <span className="font-medium">PENDING</span>
                    </p>
                  </div>
                </div>
                
                {/* Status Transitions - This would be dynamic in a real app based on status history */}
                {reservation.status !== 'PENDING' && (
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Status Updated</h4>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(reservation.updatedAt)}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Reservation status was changed to <span className={`font-medium ${getStatusBadgeClass(reservation.status)} px-2 py-0.5 rounded`}>{reservation.status}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Current State */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Current Status</h4>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Reservation is currently <span className={`font-medium ${getStatusBadgeClass(reservation.status)} px-2 py-0.5 rounded`}>{reservation.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              
              <div className="bg-gray-50 rounded-md p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>
              
              {/* Status Update Options */}
              {reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED' && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-600">Update Status:</h4>
                  
                  <div className="space-y-2">
                    {isStatusUpdateAllowed(reservation.status, 'SCHEDULED') && (
                      <button
                        onClick={() => handleStatusUpdate('SCHEDULED')}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Mark as Scheduled
                      </button>
                    )}
                    
                    {isStatusUpdateAllowed(reservation.status, 'ACTIVE') && (
                      <button
                        onClick={() => handleStatusUpdate('ACTIVE')}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Active
                      </button>
                    )}
                    
                    {isStatusUpdateAllowed(reservation.status, 'COMPLETED') && (
                      <button
                        onClick={() => handleStatusUpdate('COMPLETED')}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    
                    {(reservation.status as string) !== 'CANCELLED' && (
                      <button
                        onClick={handleCancelReservation}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/reservations/${reservation.id}/edit`)}
                  className="w-full flex items-center justify-center py-2 px-4 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit Reservation
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center py-2 px-4 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Print Details
                </button>
                
                <hr className="my-3 border-gray-200" />
                
                <button
                  onClick={() => navigate('/admin/reservations')}
                  className="w-full flex items-center justify-center py-2 px-4 text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Reservations
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-center items-center h-64">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="ml-2 text-gray-500">Reservation not found</p>
        </div>
      )}
    </div>
  );
};

export default ReservationDetail;