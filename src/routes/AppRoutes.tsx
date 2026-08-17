import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Common Layouts
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AdminLayout } from '../components/admin/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ProductsPage } from '../pages/public/ProductsPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { SpecialitiesPage } from '../pages/public/SpecialitiesPage';
import { SpecialityDetailPage } from '../pages/public/SpecialityDetailPage';
import { BrandsPage } from '../pages/public/BrandsPage';
import { ContactPage } from '../pages/public/ContactPage';
import { EnquiryPage } from '../pages/public/EnquiryPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminProductEditPage } from '../pages/admin/AdminProductEditPage';
import { AdminSpecialitiesPage } from '../pages/admin/AdminSpecialitiesPage';
import { AdminBrandsPage } from '../pages/admin/AdminBrandsPage';
import { AdminHomepagePage } from '../pages/admin/AdminHomepagePage';
import { AdminContactPage } from '../pages/admin/AdminContactPage';
import { AdminEnquiriesPage } from '../pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

// Public Website Layout wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Protected Admin Route wrapper
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-teal-300 font-medium">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/specialities" element={<SpecialitiesPage />} />
          <Route path="/specialities/:id" element={<SpecialityDetailPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductEditPage />} />
          <Route path="products/edit/:id" element={<AdminProductEditPage />} />
          <Route path="specialities" element={<AdminSpecialitiesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="homepage" element={<AdminHomepagePage />} />
          <Route path="contact" element={<AdminContactPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
};
