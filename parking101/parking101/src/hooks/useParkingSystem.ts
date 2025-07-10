import { useState, useEffect, useMemo, useCallback } from 'react';
import parkingApi, { ParkingSpot } from '../utils/parkingApiClient';


export const useParkingSystem = () => {
  // Data states
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  
  // UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filter states
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedSpots = await parkingApi.getAllParkingSpots();
      
      // CRITICAL: Make sure we're properly transforming DTOs to our internal model
      // and not including any raw DTO objects in our state
      setSpots(fetchedSpots);
      
      setSuccess('Parking data refreshed successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error fetching parking data:', err);
      setError('Failed to load parking data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Get unique levels from spots
  const getUniqueLevels = useCallback(() => {
    const levels = spots.map(spot => spot.level);
    return [...new Set(levels)].sort((a, b) => a - b);
  }, [spots]);
  
  // Get unique sections from spots
  const getUniqueSections = useCallback(() => {
    const sections = spots.map(spot => spot.section);
    return [...new Set(sections)].sort();
  }, [spots]);
  
  // Calculate parking duration
  const getParkingDuration = useCallback((entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now.getTime() - entry.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours < 1) {
      return `${diffMins} mins`;
    } else if (diffHours < 24) {
      const remainingMins = diffMins % 60;
      return `${diffHours} hrs ${remainingMins} mins`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;
      return `${diffDays} days ${remainingHours} hrs`;
    }
  }, []);
  
  // Apply filters to spots
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Level filter
      if (levelFilter && spot.level.toString() !== levelFilter) {
        return false;
      }
      
      // Section filter
      if (sectionFilter && spot.section !== sectionFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter === 'available' && spot.occupied) {
        return false;
      }
      if (statusFilter === 'occupied' && !spot.occupied) {
        return false;
      }
      
      // Search query - match spot number or license plate
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSpotNumber = spot.spotNumber.toLowerCase().includes(query);
        const matchesLicensePlate = spot.vehicleData?.licensePlate.toLowerCase().includes(query) || false;
        
        if (!matchesSpotNumber && !matchesLicensePlate) {
          return false;
        }
      }
      
      return true;
    });
  }, [spots, levelFilter, sectionFilter, statusFilter, searchQuery]);
  
  // Calculate available spots count
  const availableSpots = useMemo(() => {
    return filteredSpots.filter(spot => !spot.occupied).length;
  }, [filteredSpots]);
  
  // Debug logging to help identify issues
  useEffect(() => {
    // Check if any raw DTO objects exist in our filteredSpots
    const hasRawDTO = filteredSpots.some(spot => 
      spot.hasOwnProperty('status') || spot.hasOwnProperty('currentVehicle')
    );
    
    if (hasRawDTO) {
      console.warn('WARNING: Raw DTO objects found in filteredSpots!', 
        filteredSpots.filter(spot => spot.hasOwnProperty('status'))
      );
    }
  }, [filteredSpots]);
  
  return {
    // Data states
    filteredSpots,
    availableSpots,
    
    // UI states
    loading,
    error,
    success,
    viewMode,
    
    // Filter states
    levelFilter,
    sectionFilter,
    statusFilter,
    searchQuery,
    
    // Actions
    setLevelFilter,
    setSectionFilter,
    setStatusFilter,
    setSearchQuery,
    setViewMode,
    refreshData: fetchData,
    
    // Helpers
    getUniqueLevels,
    getUniqueSections,
    getParkingDuration
  };
};