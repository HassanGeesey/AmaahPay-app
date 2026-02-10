import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShopProvider } from './contexts/ShopContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';
import ResponsiveLayout from './components/ResponsiveLayout';
import Dashboard from './screens/Dashboard';
import CustomersScreen from './screens/CustomersScreen';
import CustomerDetailScreen from './screens/CustomerDetailScreen';
import ProductsScreen from './screens/ProductsScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import CashScreen from './screens/CashScreen';
import ReportScreen from './screens/ReportScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import CurrencySettingsScreen from './screens/CurrencySettingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BackupScreen from './screens/BackupScreen';

import LoginScreen from './screens/LoginScreen';
import AdminSignupScreen from './screens/AdminSignupScreen';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ShopProvider>
              <HashRouter>
                <Routes>
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/admin-signup" element={<AdminSignupScreen />} />
                  
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Routes>
                        <Route path="/" element={<ResponsiveLayout><Dashboard /></ResponsiveLayout>} />
                        <Route path="/customers" element={<ResponsiveLayout><CustomersScreen /></ResponsiveLayout>} />
                        <Route path="/customer/:id" element={<ResponsiveLayout><CustomerDetailScreen /></ResponsiveLayout>} />
                        <Route path="/products" element={<ResponsiveLayout><ProductsScreen /></ResponsiveLayout>} />
                        <Route path="/purchase" element={<ResponsiveLayout><PurchaseScreen /></ResponsiveLayout>} />
                        <Route path="/cash" element={<ResponsiveLayout><CashScreen /></ResponsiveLayout>} />
                        <Route path="/report" element={<ResponsiveLayout><ReportScreen /></ResponsiveLayout>} />
                        <Route path="/statistics" element={<ResponsiveLayout><StatisticsScreen /></ResponsiveLayout>} />
                        <Route path="/settings" element={<ResponsiveLayout><SettingsScreen /></ResponsiveLayout>} />
                        <Route path="/currency" element={<ResponsiveLayout><CurrencySettingsScreen /></ResponsiveLayout>} />
                        <Route path="/backup" element={<ResponsiveLayout><BackupScreen /></ResponsiveLayout>} />
                        
                      </Routes>
                    </ProtectedRoute>
                  } />
                </Routes>
              </HashRouter>
            </ShopProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
