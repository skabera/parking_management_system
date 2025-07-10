import { motion } from 'framer-motion';
import { 
  Users, 
  Car,  
  BarChart3, 
  User,
  Calendar,
  DollarSign,
  ParkingCircle,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  // Stats data for the dashboard cards
  const statsCards = [
    {
      title: 'Total Users',
      value: '254',
      change: '+12%',
      changePositive: true,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Drivers',
      value: '189',
      change: '+8%',
      changePositive: true,
      icon: Car,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: '$12,543',
      change: '+23%',
      changePositive: true,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Parking Spots',
      value: '95/120',
      change: '79%',
      changePositive: true,
      icon: ParkingCircle,
      color: 'orange'
    }
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    card.changePositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {card.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center`} 
                  style={{ 
                    backgroundColor: card.color === 'blue' ? '#dbeafe' : 
                                      card.color === 'green' ? '#dcfce7' : 
                                      card.color === 'purple' ? '#f3e8ff' : 
                                      '#ffedd5'
                  }}>
                  <Icon className="w-6 h-6" style={{ 
                    color: card.color === 'blue' ? '#2563eb' : 
                            card.color === 'green' ? '#16a34a' : 
                            card.color === 'purple' ? '#9333ea' : 
                            '#f97316'
                  }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-gray-300" />
            <p className="text-gray-500 ml-2">Chart Component</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Parking Utilization</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-300" />
            <p className="text-gray-500 ml-2">Calendar Component</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: 'John Doe', action: 'processed payment', time: '2 minutes ago' },
            { user: 'Staff01', action: 'created new reservation', time: '15 minutes ago' },
            { user: 'Admin', action: 'updated user permissions', time: '1 hour ago' },
            { user: 'Driver', action: 'completed reservation', time: '2 hours ago' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;