import {
  ArrowDownRight,
  ArrowUpRight,
  Car,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  ParkingCircle,
  RefreshCw
} from 'lucide-react';
import { SetStateAction, useEffect, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  BarChart as ReChartsBarChart,
  LineChart as ReChartsLineChart,
  PieChart as ReChartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const Analytics = () => {
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for charts
  const occupancyData = [
    { hour: '00:00', occupancy: 15 },
    { hour: '02:00', occupancy: 10 },
    { hour: '04:00', occupancy: 5 },
    { hour: '06:00', occupancy: 8 },
    { hour: '08:00', occupancy: 45 },
    { hour: '10:00', occupancy: 80 },
    { hour: '12:00', occupancy: 75 },
    { hour: '14:00', occupancy: 85 },
    { hour: '16:00', occupancy: 90 },
    { hour: '18:00', occupancy: 65 },
    { hour: '20:00', occupancy: 40 },
    { hour: '22:00', occupancy: 25 }
  ];
  
  const parkingDistributionData = [
    { name: 'Level 1', value: 42 },
    { name: 'Level 2', value: 28 },
    { name: 'Level 3', value: 20 },
    { name: 'Level 4', value: 10 }
  ];
  
  const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1300 },
    { day: 'Wed', revenue: 1400 },
    { day: 'Thu', revenue: 1800 },
    { day: 'Fri', revenue: 2400 },
    { day: 'Sat', revenue: 1600 },
    { day: 'Sun', revenue: 1000 }
  ];
  
  const driverTypeData = [
    { name: 'Regular', value: 65 },
    { name: 'Visitor', value: 25 },
    { name: 'VIP', value: 10 }
  ];
  
  const statusData = [
    { name: 'Active', value: 35 },
    { name: 'Scheduled', value: 20 },
    { name: 'Completed', value: 35 },
    { name: 'Cancelled', value: 10 }
  ];
  
  const monthlyTrendsData = [
    { month: 'Jan', occupancy: 65, revenue: 22000 },
    { month: 'Feb', occupancy: 68, revenue: 24000 },
    { month: 'Mar', occupancy: 75, revenue: 26000 },
    { month: 'Apr', occupancy: 72, revenue: 25000 },
    { month: 'May', occupancy: 80, revenue: 28000 }
  ];
  
  const parkingDurationData = [
    { name: '< 1 hour', value: 15 },
    { name: '1-3 hours', value: 40 },
    { name: '3-6 hours', value: 25 },
    { name: '6-12 hours', value: 15 },
    { name: '> 12 hours', value: 5 }
  ];
  
  const trafficData = [
    { hour: '00:00', entrances: 5, exits: 10 },
    { hour: '02:00', entrances: 3, exits: 7 },
    { hour: '04:00', entrances: 2, exits: 3 },
    { hour: '06:00', entrances: 10, exits: 5 },
    { hour: '08:00', entrances: 40, exits: 10 },
    { hour: '10:00', entrances: 25, exits: 20 },
    { hour: '12:00', entrances: 20, exits: 25 },
    { hour: '14:00', entrances: 15, exits: 15 },
    { hour: '16:00', entrances: 10, exits: 35 },
    { hour: '18:00', entrances: 5, exits: 30 },
    { hour: '20:00', entrances: 10, exits: 20 },
    { hour: '22:00', entrances: 8, exits: 15 }
  ];
  
  const sectionComparisonData = [
    { section: 'A', occupancy: 85, revenue: 5600 },
    { section: 'B', occupancy: 70, revenue: 4800 },
    { section: 'C', occupancy: 90, revenue: 6200 },
    { section: 'D', occupancy: 60, revenue: 3800 }
  ];

  // Custom colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const STATUS_COLORS = {
    'Active': '#10B981',
    'Scheduled': '#4F46E5',
    'Completed': '#8B5CF6',
    'Cancelled': '#EF4444'
  };
  
  // KPI stats
  const kpiStats = {
    occupancyRate: 76,
    occupancyChange: 8,
    revenue: 28550,
    revenueChange: 12,
    avgDuration: 4.2,
    durationChange: -0.5,
    totalVehicles: 1245,
    vehiclesChange: 15
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle time period change
  const handleTimePeriodChange = (period: SetStateAction<string>) => {
    setLoading(true);
    setTimePeriod(period);
    
    // Simulate loading new data
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Format currency
  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'revenue' ? ' USD' : entry.name === 'occupancy' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">
            Comprehensive analytics and reporting for the parking system
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={timePeriod}
              onChange={(e) => handleTimePeriodChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setLoading(true)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'occupancy'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Occupancy Analysis
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'revenue'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'trends'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usage Trends
          </button>
        </nav>
      </div>

      {/* Main Content - Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Occupancy Rate */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <ParkingCircle className="mr-1.5 h-4 w-4 text-indigo-500" />
                    Occupancy Rate
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{kpiStats.occupancyRate}%</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  kpiStats.occupancyChange >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="flex items-center">
                    {kpiStats.occupancyChange >= 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(kpiStats.occupancyChange)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-indigo-500 rounded-full" 
                  style={{ width: `${kpiStats.occupancyRate}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Compared to previous {timePeriod}
              </p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <DollarSign className="mr-1.5 h-4 w-4 text-green-500" />
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(kpiStats.revenue)}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  kpiStats.revenueChange >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="flex items-center">
                    {kpiStats.revenueChange >= 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(kpiStats.revenueChange)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="w-full bg-gray-100 rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Target</span>
                    <span className="text-xs font-medium text-gray-700">{formatCurrency(30000)}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-1.5 bg-green-500 rounded-full" 
                      style={{ width: `${(kpiStats.revenue / 30000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Compared to previous {timePeriod}
              </p>
            </div>

            {/* Average Duration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="mr-1.5 h-4 w-4 text-blue-500" />
                    Avg. Parking Duration
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{kpiStats.avgDuration} hrs</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  kpiStats.durationChange >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="flex items-center">
                    {kpiStats.durationChange >= 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(kpiStats.durationChange)}h
                  </span>
                </div>
              </div>
              <div className="mt-4 h-10">
                <div className="flex h-2 space-x-1">
                  <div className="w-1/5 h-2 bg-blue-200 rounded-l"></div>
                  <div className="w-2/5 h-2 bg-blue-300"></div>
                  <div className="w-1/5 h-2 bg-blue-400"></div>
                  <div className="w-1/10 h-2 bg-blue-500"></div>
                  <div className="w-1/10 h-2 bg-blue-600 rounded-r"></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>1h</span>
                  <span>3h</span>
                  <span>6h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Compared to previous {timePeriod}
              </p>
            </div>

            {/* Total Vehicles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Car className="mr-1.5 h-4 w-4 text-orange-500" />
                    Total Vehicles
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{kpiStats.totalVehicles}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  kpiStats.vehiclesChange >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="flex items-center">
                    {kpiStats.vehiclesChange >= 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(kpiStats.vehiclesChange)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-indigo-600 inline-block py-1 px-2 uppercase rounded-full bg-indigo-100">
                      Regular
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-600">
                      {Math.round(kpiStats.totalVehicles * 0.65)}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="h-1.5 bg-indigo-100 rounded-full">
                    <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-green-600 inline-block py-1 px-2 uppercase rounded-full bg-green-100">
                      Visitors
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-green-600">
                      {Math.round(kpiStats.totalVehicles * 0.35)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="h-1.5 bg-green-100 rounded-full">
                    <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Occupancy Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-900">Daily Occupancy Rate</h3>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsLineChart
                      data={occupancyData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" fontSize={12} tick={{ fill: '#6B7280' }} />
                      <YAxis fontSize={12} tick={{ fill: '#6B7280' }} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        name="Occupancy %"
                      />
                    </ReChartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Weekly Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-900">Weekly Revenue</h3>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsBarChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" fontSize={12} tick={{ fill: '#6B7280' }} />
                      <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue (USD)" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </ReChartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Parking Distribution by Level */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Parking by Level</h3>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={parkingDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {parkingDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Driver Type Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Driver Types</h3>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={driverTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {driverTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Reservation Status Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Reservation Status</h3>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.name === 'Active' ? STATUS_COLORS.Active :
                            entry.name === 'Scheduled' ? STATUS_COLORS.Scheduled :
                            entry.name === 'Completed' ? STATUS_COLORS.Completed :
                            STATUS_COLORS.Cancelled
                          } />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Parking Duration Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Parking Duration</h3>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={parkingDurationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {parkingDurationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Flow Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium text-gray-900">Traffic Flow (Entrances & Exits)</h3>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-80">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsBarChart
                    data={trafficData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="entrances" name="Entrances" fill="#4F46E5" stackId="a" />
                    <Bar dataKey="exits" name="Exits" fill="#EF4444" stackId="a" />
                  </ReChartsBarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Occupancy Analysis Tab */}
      {activeTab === 'occupancy' && (
        <div>
          {/* Occupancy Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Occupancy Overview</h3>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={occupancyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Occupancy %"
                    />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Occupancy by Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Occupancy by Section</h3>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsBarChart
                      data={sectionComparisonData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="section" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="occupancy" 
                        name="Occupancy %" 
                        fill="#4F46E5" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </ReChartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Parking Distribution</h3>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={parkingDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {parkingDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
          
          {/* Parking Heatmap Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Parking Occupancy Heatmap</h3>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-96 flex flex-col">
                <div className="mb-4 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Less occupied</span>
                    <div className="flex space-x-0.5">
                      <div className="w-4 h-4 bg-green-200"></div>
                      <div className="w-4 h-4 bg-green-300"></div>
                      <div className="w-4 h-4 bg-green-400"></div>
                      <div className="w-4 h-4 bg-yellow-400"></div>
                      <div className="w-4 h-4 bg-orange-400"></div>
                      <div className="w-4 h-4 bg-red-400"></div>
                      <div className="w-4 h-4 bg-red-500"></div>
                    </div>
                    <span className="text-xs text-gray-500">More occupied</span>
                  </div>
                </div>
                
                {/* Simple parking heatmap visualization */}
                <div className="flex-1 grid grid-cols-10 gap-1.5 p-4 bg-gray-100 rounded-lg">
                  {/* Level 1 */}
                  <div className="col-span-10 text-xs font-medium text-gray-700 mb-1">Level 1</div>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={`l1-${i}`} 
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium text-gray-700 ${
                        Math.random() > 0.7 ? 'bg-red-500' : 
                        Math.random() > 0.5 ? 'bg-orange-400' : 
                        Math.random() > 0.3 ? 'bg-yellow-400' : 
                        'bg-green-400'
                      }`}
                    >
                      {`A-${i+1}`.padStart(4, '0')}
                    </div>
                  ))}
                  
                  {/* Level 2 */}
                  <div className="col-span-10 text-xs font-medium text-gray-700 mt-4 mb-1">Level 2</div>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={`l2-${i}`} 
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium text-gray-700 ${
                        Math.random() > 0.7 ? 'bg-red-500' : 
                        Math.random() > 0.5 ? 'bg-orange-400' : 
                        Math.random() > 0.3 ? 'bg-yellow-400' : 
                        'bg-green-400'
                      }`}
                    >
                      {`B-${i+1}`.padStart(4, '0')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revenue Analytics Tab */}
      {activeTab === 'revenue' && (
        <div>
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Revenue by Day</h3>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsBarChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue (USD)" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </ReChartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Revenue by Section</h3>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsBarChart
                      data={sectionComparisonData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="section" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue (USD)" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </ReChartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
          
          {/* Monthly Revenue Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Monthly Revenue Trends</h3>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={monthlyTrendsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Revenue (USD)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Occupancy %"
                    />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Revenue Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Revenue per Spot</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(238)}</p>
                <p className="text-sm text-gray-500">Average revenue per parking spot</p>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    12% increase
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Revenue per Hour</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(1190)}</p>
                <p className="text-sm text-gray-500">Average hourly revenue</p>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    8% increase
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Revenue per Vehicle</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(22.95)}</p>
                <p className="text-sm text-gray-500">Average revenue per vehicle</p>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    5% increase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Trends Tab */}
      {activeTab === 'trends' && (
        <div>
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Monthly Trends</h3>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={monthlyTrendsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Occupancy %"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Revenue (USD)"
                    />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Traffic Flow */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Daily Traffic Flow</h3>
            {loading ? (
              <div className="flex justify-center items-center h-80">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={trafficData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="entrances" 
                      stroke="#4F46E5" 
                      activeDot={{ r: 6 }}
                      name="Entrances"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="exits" 
                      stroke="#EF4444" 
                      activeDot={{ r: 6 }}
                      name="Exits"
                    />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Parking Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Parking Duration Distribution</h3>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={parkingDurationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {parkingDurationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Usage Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Average Duration</span>
                    <span className="text-sm font-medium text-gray-900">4.2 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Peak Utilization</span>
                    <span className="text-sm font-medium text-gray-900">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Average Occupancy</span>
                    <span className="text-sm font-medium text-gray-900">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Repeat Users</span>
                    <span className="text-sm font-medium text-gray-900">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Cancellation Rate</span>
                    <span className="text-sm font-medium text-gray-900">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;