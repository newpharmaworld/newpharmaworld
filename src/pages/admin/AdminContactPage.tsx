import React, { useState, useEffect } from 'react';
import { Save, Loader2, Phone, MapPin, Clock, MessageSquare, Mail, Globe, Shield } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { updateSiteSettings } from '../../firebase/firestore';
import { SiteSettings } from '../../types';

export const AdminContactPage: React.FC = () => {
  const { settings, refreshSiteData, updateLocalSettings } = useSite();
  const { success, error } = useToast();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(formData);
      updateLocalSettings(formData);
      await refreshSiteData();
      success('Site settings and contact details updated immediately on the live website!');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      error(err.message || 'Failed to update site settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">
            Contact & Business Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit phone numbers, WhatsApp link, Kodambakkam address, and operating hours in real-time
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Identity & Communication */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              Identity & Quick Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Phone (for tel: dial links)
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+919840012345"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Display Text
              </label>
              <input
                type="text"
                value={formData.phoneDisplay}
                onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                placeholder="+91 98400 12345"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Number (digits only, e.g. 919840012345)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="919840012345"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Business Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@newpharmaworld.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Business Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              Address & Operating Timings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="No. 18, 1st Cross Street"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address Line 2 (Landmark)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Near Kodambakkam Railway Station"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Kodambakkam"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Chennai"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Tamil Nadu"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="600024"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Working Hours
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="Monday – Saturday: 9:00 AM – 8:30 PM | Sunday: Closed"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Maps & Regulatory Disclaimer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              Google Maps & Compliance Notice
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Maps Direct URL
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Maps Embed Iframe URL
              </label>
              <input
                type="text"
                value={formData.googleMapsEmbed}
                onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Footer Compliance & Disclaimer Statement
              </label>
              <textarea
                rows={3}
                value={formData.disclaimer}
                onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Contact & Site Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
