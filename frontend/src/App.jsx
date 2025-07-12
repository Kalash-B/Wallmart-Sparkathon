// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import DeadInventory from './pages/DeadInventory';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const navigateTo = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    setIsMobileMenuOpen(false);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          {/* Header */}
          <header className="bg-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fas fa-box-open text-2xl"></i>
                <h1 className="text-xl font-bold">Smart Inventory</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="desktop-menu hidden md:block">
                <ul className="flex space-x-6">
                  <li>
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className={`py-2 px-1 ${currentPage === 'dashboard' ? 'border-b-2 border-white font-bold' : 'hover:text-gray-200'}`}
                    >
                      <i className="fas fa-chart-line mr-2"></i>Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('inventory')}
                      className={`py-2 px-1 ${currentPage === 'inventory' ? 'border-b-2 border-white font-bold' : 'hover:text-gray-200'}`}
                    >
                      <i className="fas fa-boxes mr-2"></i>Inventory
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('sales')}
                      className={`py-2 px-1 ${currentPage === 'sales' ? 'border-b-2 border-white font-bold' : 'hover:text-gray-200'}`}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Sales
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('deadInventory')}
                      className={`py-2 px-1 ${currentPage === 'deadInventory' ? 'border-b-2 border-white font-bold' : 'hover:text-gray-200'}`}
                    >
                      <i className="fas fa-exclamation-triangle mr-2"></i>Dead Inventory
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                  <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                </button>
              </div>

              {/* User Menu */}
              <div className="relative ml-4" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white"
                >
                  {user.name.charAt(0)}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="bg-indigo-700 py-2 px-4 md:hidden">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className={`block w-full text-left py-2 px-1 ${currentPage === 'dashboard' ? 'font-bold' : ''}`}
                    >
                      <i className="fas fa-chart-line mr-2"></i>Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('inventory')}
                      className={`block w-full text-left py-2 px-1 ${currentPage === 'inventory' ? 'font-bold' : ''}`}
                    >
                      <i className="fas fa-boxes mr-2"></i>Inventory
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('sales')}
                      className={`block w-full text-left py-2 px-1 ${currentPage === 'sales' ? 'font-bold' : ''}`}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>Sales
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('deadInventory')}
                      className={`block w-full text-left py-2 px-1 ${currentPage === 'deadInventory' ? 'font-bold' : ''}`}
                    >
                      <i className="fas fa-exclamation-triangle mr-2"></i>Dead Inventory
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8 relative">
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
              )}

              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'inventory' && <Inventory />}
              {currentPage === 'sales' && <Sales />}
              {currentPage === 'deadInventory' && <DeadInventory />}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>Smart Inventory Optimization System &copy; 2025</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
