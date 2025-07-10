import React, { useState } from 'react';
import { NavLink, NavLinkRenderProps, To, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  UserCog,
  ParkingCircle,
} from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

// Define menu structure
interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AdminSidebar = ({ isCollapsed, toggleCollapse }: AdminSidebarProps) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  
  // Function to check if a path is active
  const isPathActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path && path !== '/admin') {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Menu structure aligned with your routes
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      hasBadge: false,
      hasSubmenu: false,
      submenuItems: []
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      path: '/admin/user-management',
      hasSubmenu: false
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Car,
      path: '/admin/drivers',
      hasSubmenu: false
    },
    {
      id: 'parking',
      label: 'Parking System',
      icon: ParkingCircle,
      path: '/admin/parking-system',
      hasSubmenu: false
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: Calendar,
      path: '/admin/reservations',
      hasSubmenu: false
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
      hasSubmenu: false
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      hasSubmenu: false
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      hasSubmenu: false
    }
  ];

  return (
    <motion.div
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'p-6'}`}>
        {!isCollapsed ? (
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
              <ParkingCircle className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ParkSmart</h1>
              <p className="text-xs text-blue-200">Admin Dashboard</p>
            </div>
          </motion.div>
        ) : (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <ParkingCircle className="w-5 h-5 text-blue-800" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="mt-4 overflow-y-auto h-[calc(100vh-200px)]">
        {menuItems.map((item) => {
          const isActive = isPathActive(item.path);
          
          return (
            <div key={item.id} className="mb-1">
              <motion.div
                whileHover={{ x: !item.hasSubmenu ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.hasSubmenu ? (
                  <motion.button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex items-center w-full ${
                      isCollapsed ? 'justify-center px-4' : 'px-6'
                    } py-3 cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white border-l-4 border-yellow-400' 
                        : 'hover:bg-white/5 text-blue-100 hover:text-white'
                    }`}
                  >
                    <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    {!isCollapsed && (
                      <span className="ml-3 flex-1">{item.label}</span>
                    )}
                    {!isCollapsed && item.hasSubmenu && (
                      <motion.div
                        animate={{ rotate: openMenus[item.id] ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ) : (
                  <NavLink
                    to={item.path || '#'}
                    className={({ isActive }) => `flex items-center ${
                      isCollapsed ? 'justify-center px-4' : 'px-6'
                    } py-3 cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white border-l-4 border-yellow-400' 
                        : 'hover:bg-white/5 text-blue-100 hover:text-white'
                    }`}
                  >
                    <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    {!isCollapsed && (
                      <span className="ml-3 flex-1">{item.label}</span>
                    )}
                  </NavLink>
                )}
              </motion.div>

              {/* Submenu Items (if needed in the future) */}
              <AnimatePresence>
                {!isCollapsed && item.hasSubmenu && openMenus[item.id] && item.submenuItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-blue-900/50"
                  >
                    {item.submenuItems?.map((subItem: { id: React.Key | null | undefined; path: To; icon: JSX.IntrinsicAttributes; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | null | undefined> | ((props: NavLinkRenderProps) => React.ReactNode) | null | undefined; }) => (
                      <NavLink
                        key={subItem.id}
                        to={subItem.path}
                        className={({ isActive }) => `flex items-center px-12 py-2.5 text-sm transition-all ${
                          isActive 
                            ? 'bg-white/5 text-white' 
                            : 'text-blue-200 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {React.isValidElement(subItem.icon) ? (
                          React.isValidElement(subItem.icon) 
                            ? React.cloneElement(subItem.icon as React.ReactElement) 
                            : null
                        ) : null}
                        {typeof subItem.label === 'function' || subItem.label instanceof Promise
                          ? null
                          : subItem.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleCollapse}
        className="absolute -right-4 top-6 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-blue-800 rotate-90" />
        </motion.div>
      </motion.button>

      {/* User Profile */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <UserCog className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-blue-300">Administrator</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;