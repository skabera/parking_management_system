import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ParkingCircle, 
  RefreshCw, 
  Filter,
  CheckCircle,
  AlertCircle,
  Car,
  List,
  Grid as GridIcon,
  Search
} from 'lucide-react';


import { useParkingSystem } from '../../hooks/useParkingSystem';

const ParkingSystem: React.FC = () => {
  const navigate = useNavigate();
  
  // Use our custom hook to handle state and API interactions
  const {
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
    refreshData,
    
    // Helpers
    getUniqueLevels,
    getUniqueSections,
    getParkingDuration
  } = useParkingSystem();

  console.log("filteredSpots",filteredSpots)
  
  // Handle navigation to operations page
  const handleGoToOperations = () => {
    navigate('/admin/parking-system/operations');
  };
  
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Parking System</h2>
          <p className="text-sm text-gray-500">
            Overview of all parking spots in the system
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleGoToOperations}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Car className="mr-2 h-4 w-4" />
            Parking Operations
          </button>
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spots</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredSpots.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ParkingCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Spots</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{availableSpots}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Occupied Spots</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {filteredSpots.length - availableSpots}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by spot number or license plate..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
            
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Levels</option>
              {getUniqueLevels().map(level => (
                <option key={level} value={level.toString()}>Level {level}</option>
              ))}
            </select>
            
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Sections</option>
              {getUniqueSections().map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border ${viewMode === 'list' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'} rounded-md`}
                aria-label="List view"
              >
                <List className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border ${viewMode === 'grid' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'} rounded-md`}
                aria-label="Grid view"
              >
                <GridIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Parking Spots Display */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="ml-2 text-gray-500">Loading parking spots...</p>
        </div>
      ) : filteredSpots.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid view
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parking Spots</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredSpots.map(spot => (
                <div 
                  key={spot.spotId}
                  className={`relative border rounded-lg p-4 ${
                    spot.occupied 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-bold">{spot.spotNumber}</p>
                      <p className="text-xs text-gray-500">
                        Level {spot.level} • Section {spot.section}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      spot.occupied ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  
                  {spot.occupied && spot.vehicleData && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="text-xs font-medium">{spot.vehicleData.licensePlate}</p>
                      <p className="text-xs text-gray-500">
                        {getParkingDuration(spot.vehicleData.entryTime)}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-2 flex justify-end">
                    <Link
                      to={`/admin/parking-system/operations?spotNumber=${spot.spotNumber}`}
                      className={`text-xs px-2 py-1 ${
                        spot.occupied 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } rounded`}
                    >
                      {spot.occupied ? 'Release' : 'Park'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // List view
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Parking Spots</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spot Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSpots.map(spot => (
                    <tr key={spot.spotId} className={spot.occupied ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{spot.spotNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Level {spot.level}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Section {spot.section}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          spot.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {spot.occupied ? 'Occupied' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {spot.occupied && spot.vehicleData ? (
                          spot.vehicleData.licensePlate
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {spot.occupied && spot.vehicleData ? (
                          getParkingDuration(spot.vehicleData.entryTime)
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/parking-system/operations?spotNumber=${spot.spotNumber}`}
                          className={`text-${spot.occupied ? 'red' : 'blue'}-600 hover:text-${spot.occupied ? 'red' : 'blue'}-900`}
                        >
                          {spot.occupied ? 'Release' : 'Park'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="ml-2 text-gray-500">No parking spots found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ParkingSystem;