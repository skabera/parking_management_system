import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car,
  CheckCircle,
  AlertCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import parkingApi, { ParkingSpot } from '../../utils/parkingApiClient';

const ParkingOperations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get spotNumber from URL params if available
  const spotNumberParam = searchParams.get('spotNumber');
  
  // State
  const [selectedSpot, setSelectedSpot] = useState<string>(spotNumberParam || '');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
  const [occupiedSpots, setOccupiedSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch available and occupied spots on component mount
  useEffect(() => {
    fetchSpots();
  }, []);
  
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
  
  // Fetch parking spots and categorize them
  const fetchSpots = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const spots = await parkingApi.getAllParkingSpots();
      
      // Split into available and occupied
      const available: ParkingSpot[] = [];
      const occupied: ParkingSpot[] = [];
      
      spots.forEach(spot => {
        if (spot.occupied) {
          occupied.push(spot);
        } else {
          available.push(spot);
        }
      });
      
      setAvailableSpots(available);
      setOccupiedSpots(occupied);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch parking spots';
      setError(errorMessage);
      
      // Handle authentication errors
      if (errorMessage.includes('Authentication failed')) {
        navigate('/auth/login', { state: { from: '/admin/parking-system/operations' } });
      }
      
      console.error('Error fetching parking spots:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle parking a vehicle
  const handleParkVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSpot) {
      setError('Please select a parking spot');
      return;
    }
    
    if (!licensePlate) {
      setError('Please enter a license plate number');
      return;
    }
    
    setOperationLoading(true);
    setError(null);
    
    try {
      await parkingApi.parkVehicle(selectedSpot, licensePlate);
      setSuccess(`Vehicle ${licensePlate} successfully parked in spot ${selectedSpot}`);
      setLicensePlate('');
      await fetchSpots();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to park vehicle';
      setError(errorMessage);
      console.error('Error parking vehicle:', err);
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Handle releasing a vehicle
  const handleReleaseVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSpot) {
      setError('Please select an occupied parking spot');
      return;
    }
    
    setOperationLoading(true);
    setError(null);
    
    try {
      await parkingApi.releaseVehicle(selectedSpot);
      setSuccess(`Vehicle successfully released from spot ${selectedSpot}`);
      await fetchSpots();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to release vehicle';
      setError(errorMessage);
      console.error('Error releasing vehicle:', err);
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Format relative time for parking duration
  const getParkingDuration = (entryTime: string) => {
    const entryDate = new Date(entryTime);
    const now = new Date();
    const durationMs = now.getTime() - entryDate.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get details of selected spot
  const getSelectedSpotDetails = () => {
    // Check in available spots
    const availableSpot = availableSpots.find(spot => spot.spotNumber === selectedSpot);
    if (availableSpot) {
      return {
        isOccupied: false,
        level: availableSpot.level,
        section: availableSpot.section
      };
    }
    
    // Check in occupied spots
    const occupiedSpot = occupiedSpots.find(spot => spot.spotNumber === selectedSpot);
    if (occupiedSpot) {
      return {
        isOccupied: true,
        level: occupiedSpot.level,
        section: occupiedSpot.section,
        licensePlate: occupiedSpot.vehicleData?.licensePlate,
        entryTime: occupiedSpot.vehicleData?.entryTime
      };
    }
    
    return null;
  };
  
  const selectedSpotDetails = getSelectedSpotDetails();
  
  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/parking-system')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Back to Parking System"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Parking Operations</h2>
          <p className="text-sm text-gray-500">
            Manage vehicle entry and exit
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
        {/* Operation Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Spot Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Parking Spot</h3>
            
            <div className="mb-4">
              <label htmlFor="spot-select" className="block text-sm font-medium text-gray-700 mb-1">
                Parking Spot
              </label>
              <select
                id="spot-select"
                value={selectedSpot}
                onChange={(e) => setSelectedSpot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select a spot --</option>
                <optgroup label="Available Spots">
                  {availableSpots.map(spot => (
                    <option key={`available-${spot.spotId}`} value={spot.spotNumber}>
                      {spot.spotNumber} (Level {spot.level}, Section {spot.section})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Occupied Spots">
                  {occupiedSpots.map(spot => (
                    <option key={`occupied-${spot.spotId}`} value={spot.spotNumber}>
                      {spot.spotNumber} (Level {spot.level}, Section {spot.section})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            {selectedSpotDetails && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Spot Details</h4>
                <p className="text-sm text-gray-600">Spot: <span className="font-semibold">{selectedSpot}</span></p>
                <p className="text-sm text-gray-600">Level: <span className="font-semibold">{selectedSpotDetails.level}</span></p>
                <p className="text-sm text-gray-600">Section: <span className="font-semibold">{selectedSpotDetails.section}</span></p>
                <p className="text-sm text-gray-600">Status: 
                  <span className={`font-semibold ${selectedSpotDetails.isOccupied ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedSpotDetails.isOccupied ? ' Occupied' : ' Available'}
                  </span>
                </p>
                
                {selectedSpotDetails.isOccupied && selectedSpotDetails.licensePlate && selectedSpotDetails.entryTime && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">License Plate: <span className="font-semibold">{selectedSpotDetails.licensePlate}</span></p>
                    <p className="text-sm text-gray-600">Duration: <span className="font-semibold">{getParkingDuration(selectedSpotDetails.entryTime)}</span></p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Park Vehicle Form */}
          {selectedSpotDetails && !selectedSpotDetails.isOccupied && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Park Vehicle</h3>
              
              <form onSubmit={handleParkVehicle}>
                <div className="mb-4">
                  <label htmlFor="license-plate" className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <input
                    id="license-plate"
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="Enter license plate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {operationLoading ? (
                    <>
                      <Car className="animate-pulse mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Park Vehicle
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Release Vehicle Form */}
          {selectedSpotDetails && selectedSpotDetails.isOccupied && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Release Vehicle</h3>
              
              <form onSubmit={handleReleaseVehicle}>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to release the vehicle with license plate 
                  <span className="font-semibold"> {selectedSpotDetails.licensePlate} </span> 
                  from spot <span className="font-semibold">{selectedSpot}</span>?
                </p>
                
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {operationLoading ? (
                    <>
                      <Car className="animate-pulse mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-5 w-5" />
                      Release Vehicle
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Parking Spots Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parking Status</h3>
            
            {loading ? (
              <div className="py-10 flex justify-center items-center">
                <Car className="h-8 w-8 text-indigo-500 animate-pulse" />
                <p className="ml-2 text-gray-500">Loading parking spots...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-green-800 flex items-center mb-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Available Spots ({availableSpots.length})
                  </h4>
                  
                  {availableSpots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableSpots.map(spot => (
                        <button
                          key={spot.spotId}
                          onClick={() => setSelectedSpot(spot.spotNumber)}
                          className={`p-2 text-center border rounded ${
                            selectedSpot === spot.spotNumber
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <p className="font-medium">{spot.spotNumber}</p>
                          <p className="text-xs text-gray-500">
                            L{spot.level} / S{spot.section}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No available spots</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-red-800 flex items-center mb-2">
                    <Car className="mr-2 h-4 w-4" />
                    Occupied Spots ({occupiedSpots.length})
                  </h4>
                  
                  {occupiedSpots.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spot</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {occupiedSpots.map(spot => (
                            <tr 
                              key={spot.spotId}
                              className={selectedSpot === spot.spotNumber ? 'bg-red-50' : ''}
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                {spot.spotNumber}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                L{spot.level} / S{spot.section}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {spot.vehicleData?.licensePlate}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {spot.vehicleData?.entryTime && getParkingDuration(spot.vehicleData.entryTime)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <button
                                  onClick={() => setSelectedSpot(spot.spotNumber)}
                                  className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                                    selectedSpot === spot.spotNumber
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedSpot === spot.spotNumber ? 'Selected' : 'Select'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No occupied spots</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingOperations;