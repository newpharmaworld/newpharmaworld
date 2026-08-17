import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Pill,
  FileText,
  Filter,
  Eye,
  Save,
  Loader2
} from 'lucide-react';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../firebase/firestore';
import { Enquiry } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { formatDate, getWhatsAppUrl, getTelUrl } from '../../utils/formatters';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const openDetailModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setAdminNotes(enq.adminNotes || '');
  };

  const handleStatusUpdate = async (newStatus: Enquiry['status']) => {
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, newStatus, adminNotes);
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id
            ? { ...e, status: newStatus, adminNotes, updatedAt: new Date().toISOString() }
            : e
        )
      );
      setSelectedEnquiry({
        ...selectedEnquiry,
        status: newStatus,
        adminNotes,
        updatedAt: new Date().toISOString(),
      });
      success(`Enquiry marked as ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update enquiry status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, adminNotes);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, adminNotes } : e))
      );
      success('Internal follow-up notes saved!');
    } catch (err: any) {
      error(err.message || 'Failed to save notes');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEnquiry(enquiryToDelete.id);
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id));
      success('Enquiry removed');
      setEnquiryToDelete(null);
      if (selectedEnquiry?.id === enquiryToDelete.id) {
        setSelectedEnquiry(null);
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete enquiry');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">
            Customer & Hospital Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming medicine requests, update fulfillment status, and directly contact clients
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'contacted', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} ({st === 'all' ? enquiries.length : enquiries.filter((e) => e.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Contact Details</th>
              <th className="p-4">Medicine / Requisition</th>
              <th className="p-4">Date Received</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loading customer enquiries...
                </td>
              </tr>
            ) : filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No enquiries found in this category.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-navy-900">{enq.name}</td>
                  <td className="p-4 text-slate-600">
                    <div className="space-y-0.5">
                      <a href={getTelUrl(enq.phone)} className="hover:text-teal-700 font-medium block">
                        {enq.phone}
                      </a>
                      {enq.email && <span className="text-slate-400 block text-[11px]">{enq.email}</span>}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{enq.product || 'General Medicine Enquiry'}</td>
                  <td className="p-4 text-slate-500">{formatDate(enq.createdAt)}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        enq.status === 'new'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : enq.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    <a
                      href={getWhatsAppUrl(enq.phone, `Hello ${enq.name}, regarding your enquiry for ${enq.product || 'pharmaceutical supply'} with New Pharma World:`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="WhatsApp Customer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openDetailModal(enq)}
                      className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      title="View Details & Notes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEnquiryToDelete(enq)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail & Follow-up Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.name}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Meta Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Customer</span>
                <span className="font-bold text-navy-900 text-sm">{selectedEnquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Phone</span>
                <a href={getTelUrl(selectedEnquiry.phone)} className="font-bold text-teal-700 hover:underline">
                  {selectedEnquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Email</span>
                <span className="text-slate-700">{selectedEnquiry.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Medicine</span>
                <span className="font-bold text-teal-900">{selectedEnquiry.product || 'General Requisition'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Date</span>
                <span className="text-slate-600">{formatDate(selectedEnquiry.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Current Status</span>
                <span className="font-bold uppercase text-teal-700">{selectedEnquiry.status}</span>
              </div>
            </div>

            {/* Customer Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Customer Message
              </label>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppUrl(selectedEnquiry.phone, `Hello ${selectedEnquiry.name}, regarding your enquiry for ${selectedEnquiry.product || 'pharmaceutical supply'} with New Pharma World:`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
              <a
                href={getTelUrl(selectedEnquiry.phone)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Call Client</span>
              </a>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Internal Follow-Up Notes
                </label>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isUpdatingStatus}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Quoted batch price, delivery promised for Wednesday afternoon..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Status Change Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Change Status:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedEnquiry.status === 'new'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate('contacted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedEnquiry.status === 'contacted'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate('resolved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedEnquiry.status === 'resolved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <ConfirmModal
          isOpen={!!enquiryToDelete}
          onClose={() => setEnquiryToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Enquiry"
          message={`Are you sure you want to remove the enquiry from ${enquiryToDelete.name}?`}
          confirmText="Yes, Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
