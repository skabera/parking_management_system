import {  useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import parking from "../../assets/parking.jpg";

// API configuration
const authApi = {
  register: async (credentials:unknown) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }
    
    return response.json();
  },
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Store the token if provided in response
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to login or dashboard
      window.location.href = '/auth/login';
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    registerMutation.mutate({ username, password, role });
  };

  const roleOptions = [
    // { value: 'USER', label: 'User', description: 'Standard user access' },
    { value: 'STAFF', label: 'Staff', description: 'Staff member access' },
    { value: 'ADMIN', label: 'Admin', description: 'Administrative access' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex items-center justify-center">
        <div className="flex bg-white rounded-xl shadow-xl overflow-hidden max-w-6xl w-full">
          {/* Left side - Image */}
          <motion.div 
            className="hidden lg:block lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={parking}
              alt="Modern parking facility"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-800/80 flex items-center justify-center">
              <div className="text-white p-8">
                <h2 className="text-4xl font-bold mb-4">Join ParkSmart</h2>
                <p className="text-xl text-blue-100">
                  Create an account to manage your parking operations efficiently
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Registration Form */}
          <motion.div 
            className="w-full lg:w-1/2 p-8 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Join our parking management system today
              </p>
            </div>

            {/* Registration Form */}
            <div className="space-y-6">
              {/* Username Input */}
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password !== confirmPassword && confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </motion.div>

              {/* Role Selection */}
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {roleOptions.map((option) => (
                    <motion.label
                      key={option.value}
                      className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${
                        role === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={role === option.value}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 transition-all ${
                            role === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {role === option.value && (
                              <div className="w-full h-full rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 ml-7">{option.description}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Error Message */}
              {registerMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-sm text-red-600">
                    {registerMutation.error?.message || 'Registration failed. Please try again.'}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={registerMutation.isPending || password !== confirmPassword}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  registerMutation.isPending || password !== confirmPassword 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                whileHover={!registerMutation.isPending && password === confirmPassword ? { scale: 1.02 } : {}}
                whileTap={!registerMutation.isPending && password === confirmPassword ? { scale: 0.98 } : {}}
              >
                {registerMutation.isPending ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </motion.button>

              {/* Sign in link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;