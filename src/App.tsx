import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  // Use BrowserRouter with dynamic base path or fallback
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AuthProvider>
          <SiteProvider>
            <AppRoutes />
          </SiteProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
