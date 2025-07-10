// useReservations.ts
// Custom hook for managing reservations state and API interactions

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationsApi, { Reservation, CreateReservationDTO } from '../utils/ReservationApiClient';

export interface ReservationsState {
  // Data states
  reservations: Reservation[];
  filteredReservations: Reservation[];
  
  // UI states
  loading: boolean;
  error: string | null;
  success: string | null;
  statusFilter: string;
  searchQuery: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  
  // Actions
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  refreshReservations: () => Promise<void>;
  createReservation: (reservation: CreateReservationDTO) => Promise<Reservation>;
  cancelReservation: (id: number) => Promise<void>;
  updateReservationStatus: (id: number, status: string) => Promise<void>;
  
  // Helpers
  getReservationStats: () => { 
    total: number;
    active: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  formatDateTime: (dateStr: string) => string;
  getStatusBadgeClass: (status: string) => string;
  handleSort: (field: string) => void;
}

export function useReservations(): ReservationsState {
  const navigate = useNavigate();
  
  // Data states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  
  // UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch all reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await reservationsApi.getAllReservations();
      setReservations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reservations';
      setError(errorMessage);
      
      // Handle authentication errors
      if (errorMessage.includes('Authentication failed')) {
        navigate('/auth/login', { state: { from: window.location.pathname } });
      }
      
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  
  // Refresh reservations
  const refreshReservations = useCallback(async () => {
    await fetchReservations();
  }, [fetchReservations]);
  
  // Create a new reservation
  const createReservation = useCallback(async (reservation: CreateReservationDTO): Promise<Reservation> => {
    setLoading(true);
    setError(null);
    
    try {
      const newReservation = await reservationsApi.createReservation(reservation);
      setSuccess('Reservation created successfully');
      await refreshReservations();
      return newReservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(errorMessage);
      console.error('Error creating reservation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshReservations]);
  
  // Cancel a reservation
  const cancelReservation = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await reservationsApi.cancelReservation(id);
      setSuccess('Reservation cancelled successfully');
      await refreshReservations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel reservation';
      setError(errorMessage);
      console.error('Error cancelling reservation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshReservations]);
  
  // Update reservation status
  const updateReservationStatus = useCallback(async (id: number, status: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await reservationsApi.updateReservationStatus(id, status);
      setSuccess(`Reservation status updated to ${status}`);
      await refreshReservations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update reservation status';
      setError(errorMessage);
      console.error('Error updating reservation status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshReservations]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...reservations];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(res => res.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(res => 
        res.driverName.toLowerCase().includes(query) ||
        res.licensePlate.toLowerCase().includes(query) ||
        res.spotNumber.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof Reservation];
      const fieldB = b[sortField as keyof Reservation];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        if (sortDirection === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      } else {
        if (sortDirection === 'asc') {
          return fieldA < fieldB ? -1 : 1;
        } else {
          return fieldA > fieldB ? -1 : 1;
        }
      }
    });
    
    setFilteredReservations(result);
  }, [reservations, statusFilter, searchQuery, sortField, sortDirection]);
  
  // Initial data load
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  // Helper method to get reservation stats
  const getReservationStats = useCallback(() => {
    const total = reservations.length;
    const active = reservations.filter(r => r.status === 'ACTIVE').length;
    const scheduled = reservations.filter(r => r.status === 'SCHEDULED').length;
    const completed = reservations.filter(r => r.status === 'COMPLETED').length;
    const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
    
    return { total, active, scheduled, completed, cancelled };
  }, [reservations]);
  
  // Format date
  const formatDateTime = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  }, []);
  
  // Get status badge class
  const getStatusBadgeClass = useCallback((status: string) => {
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
  }, []);
  
  // Handle sorting
  const handleSort = useCallback((field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);
  
  return {
    // Data states
    reservations,
    filteredReservations,
    
    // UI states
    loading,
    error,
    success,
    statusFilter,
    searchQuery,
    sortField,
    sortDirection,
    
    // Actions
    setStatusFilter,
    setSearchQuery,
    setSortField,
    setSortDirection,
    refreshReservations,
    createReservation,
    cancelReservation,
    updateReservationStatus,
    
    // Helpers
    getReservationStats,
    formatDateTime,
    getStatusBadgeClass,
    handleSort
  };
}