import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  Building2,
  MessageSquare,
  Plus,
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  getProducts,
  getSpecialities,
  getBrands,
  getEnquiries,
  seedInitialDatabase,
  updateEnquiryStatus
} from '../../firebase/firestore';
import { Product, Speciality, Brand, Enquiry } from '../../types';
import { useToast } from '../../context/ToastContext';
import { formatDate, getWhatsAppUrl, getTelUrl } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [specialitiesCount, setSpecialitiesCount] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { success, error, info } = useToast();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [prods, specs, brs, enqs] = await Promise.all([
        getProducts(),
        getSpecialities(),
        getBrands(),
        getEnquiries(),
      ]);

      setProductsCount(prods.length);
      setSpecialitiesCount(specs.length);
      setBrandsCount(brs.length);
      setEnquiries(enqs);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will seed the initial 6 Specialities, 8 Brands, Demo Products, and default Site Settings into your Cloud Firestore database. Continue?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const res = await seedInitialDatabase();
      if (res.success) {
        success(res.message);
        await loadDashboardData();
      } else {
        error(res.message);
      }
    } catch (err: any) {
      error(err.message || 'Seeding failed');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleStatusChange = async (enquiryId: string, newStatus: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      success(`Enquiry marked as ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-900">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for New Pharma World (Kodambakkam, Chennai)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            title="Seed initial specialities, brands & demo products to Firestore"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Seeding Firestore...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>Initialize / Seed Demo Data</span>
              </>
            )}
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Products */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catalogue Products</span>
            <div className="text-3xl font-extrabold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
              {loading ? '...' : productsCount}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Manage Catalogue →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 2: Total Brands */}
        <Link
          to="/admin/brands"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Partner Brands</span>
            <div className="text-3xl font-extrabold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
              {loading ? '...' : brandsCount}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Manage Brands →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-900 group-hover:text-white transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 3: Specialities */}
        <Link
          to="/admin/specialities"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Specialities</span>
            <div className="text-3xl font-extrabold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
              {loading ? '...' : specialitiesCount}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Manage Categories →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Sparkles className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 4: New Enquiries */}
        <Link
          to="/admin/enquiries"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Enquiries</span>
            <div className="text-3xl font-extrabold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
              {loading ? '...' : newEnquiriesCount}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Total: {enquiries.length} →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold font-display text-navy-900 uppercase tracking-wider">
            Live Website Content
          </h3>
          <p className="text-xs text-slate-500">
            Edit Hero headlines, trust badges, about highlights, and CTA copy in real-time.
          </p>
          <Link
            to="/admin/homepage"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Edit Homepage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold font-display text-navy-900 uppercase tracking-wider">
            Business Contact Details
          </h3>
          <p className="text-xs text-slate-500">
            Update Phone, WhatsApp number, Kodambakkam address, and business hours.
          </p>
          <Link
            to="/admin/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Edit Contact & Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold font-display text-navy-900 uppercase tracking-wider">
            Security & Backup
          </h3>
          <p className="text-xs text-slate-500">
            Review Firestore security rules, Firebase Spark plan usage, and export data.
          </p>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View Tools & Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-navy-900">
              Recent Supply Enquiries
            </h2>
            <p className="text-xs text-slate-500">
              Customer enquiries received through the website
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600">No customer enquiries submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3">Customer / Org</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-navy-900">{enq.name}</td>
                    <td className="p-3 text-slate-600">
                      <a href={getTelUrl(enq.phone)} className="hover:text-teal-700 underline">
                        {enq.phone}
                      </a>
                    </td>
                    <td className="p-3 text-slate-700">{enq.product || 'General Enquiry'}</td>
                    <td className="p-3 text-slate-500">{formatDate(enq.createdAt)}</td>
                    <td className="p-3">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as Enquiry['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                          enq.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : enq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <a
                        href={getWhatsAppUrl(enq.phone, `Hello ${enq.name}, regarding your enquiry for ${enq.product || 'pharmaceutical supply'} with New Pharma World:`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
