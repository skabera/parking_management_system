import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Car, Shield, Clock, Menu, X } from 'lucide-react';
import parking from "../assets/parking.jpg";
import { useNavigate } from 'react-router';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate()
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav 
        className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <Car className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">ParkSmart</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                How it Works
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                About
              </motion.a>
              <motion.a 
                href="/auth/login" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div 
            className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-2 pb-4 border-t border-gray-100">
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">About</a>
              <a 
                href="/login" 
                className="block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-center"
              >
                Login
              </a>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden pt-16"
    //   {/* Hero Section */}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img 
            src={parking} 
            alt="Modern parking facility"
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-blue-900/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <motion.div 
            className="max-w-3xl"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-4xl sm:text-6xl font-bold mb-6"
              variants={fadeInUp}
            >
              Smart Parking Management Made Simple
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-blue-100"
              variants={fadeInUp}
            >
              Streamline your parking operations with our intelligent management system. Save time, reduce costs, and enhance customer satisfaction.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              variants={fadeInUp}
            >
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2" onClick={() => navigate("/auth/login")}>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our parking management solution combines cutting-edge technology with user-friendly design to deliver exceptional results.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Car,
                title: "Real-time Monitoring",
                description: "Track parking availability and vehicle movement in real-time with our advanced sensors and cameras."
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Protect your facility with 24/7 surveillance, license plate recognition, and automated alerts."
              },
              {
                icon: Clock,
                title: "Automated Operations",
                description: "Automate entry/exit processes, payment collection, and generate detailed reports effortlessly."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 p-8 rounded-xl"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 bg-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running in minutes with our simple, four-step process.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                title: "Setup",
                description: "Install our hardware and configure the system to your facility's specifications."
              },
              {
                step: "02",
                title: "Integration",
                description: "Connect with your existing systems and customize settings to your needs."
              },
              {
                step: "03",
                title: "Training",
                description: "We provide comprehensive training for your staff to ensure smooth operations."
              },
              {
                step: "04",
                title: "Go Live",
                description: "Launch your smart parking system and start optimizing your operations immediately."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={scaleIn}
              >
                {index < 3 && (
                  <motion.div 
                    className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-blue-200"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  />
                )}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-5xl font-bold text-blue-600 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Parking Management?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join hundreds of businesses already using our solution to optimize their parking operations.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "500+", label: "Parking Lots Managed" },
              { number: "1M+", label: "Vehicles Tracked Daily" },
              { number: "99.9%", label: "System Uptime" },
              { number: "30%", label: "Average Cost Savings" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={scaleIn}
              >
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;