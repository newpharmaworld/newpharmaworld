import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, Menu, X, MapPin, Clock, Shield } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl, getTelUrl } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSite();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Specialities', path: '/specialities' },
    { name: 'Brands', path: '/brands' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-slate-100">
      {/* Top Notification Bar */}
      <div className="bg-navy-900 text-slate-300 text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{settings.area}, {settings.city} – {settings.pincode}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={getTelUrl(settings.phone)}
              className="flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phoneDisplay || settings.phone}</span>
            </a>
            <span className="hidden sm:inline text-navy-600">|</span>
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:bg-teal-700 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-navy-900 block leading-none">
                NEW PHARMA <span className="text-teal-600">WORLD</span>
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide mt-1 block">
                {settings.tagline || 'Your Trusted Pharmaceutical Partner'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-semibold'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Enquire Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/enquiry"
              onClick={closeMobileMenu}
              className="w-full text-center py-3 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
            >
              Send Enquiry
            </Link>
            <a
              href={getTelUrl(settings.phone)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-navy-900 bg-slate-100 hover:bg-slate-200"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>Call: {settings.phoneDisplay || settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
