import React, { useState, useEffect } from 'react';
import { Save, Loader2, Home, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { updateHomepageContent } from '../../firebase/firestore';
import { ImageUploader } from '../../components/common/ImageUploader';
import { HomepageContent } from '../../types';

export const AdminHomepagePage: React.FC = () => {
  const { homepage, refreshSiteData, updateLocalHomepage } = useSite();
  const { success, error } = useToast();
  const [formData, setFormData] = useState<HomepageContent>(homepage);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(homepage);
  }, [homepage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateHomepageContent(formData);
      updateLocalHomepage(formData);
      await refreshSiteData();
      success('Homepage content updated instantly! The live website is updated.');
    } catch (err: any) {
      console.error('Error saving homepage content:', err);
      error(err.message || 'Failed to update homepage content');
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
            Homepage Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic updates reflect on the live website immediately without rebuilds or redeployment
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
        {/* Section 1: Hero Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Home className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              Hero Section
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hero Pill Badge
              </label>
              <input
                type="text"
                value={formData.hero.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, badge: e.target.value },
                  })
                }
                placeholder="Authorized Pharmaceutical Supplier in Chennai"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.hero.headline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, headline: e.target.value },
                  })
                }
                placeholder="Quality Medicines. Trusted Healthcare."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                placeholder="Your Trusted Pharmaceutical Partner in Chennai"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hero Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value },
                  })
                }
                placeholder="Genuine pharmaceutical products, trusted brands and reliable healthcare supply..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploader
                currentImageUrl={formData.hero.heroImageUrl}
                onImageUploaded={(url) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, heroImageUrl: url },
                  })
                }
                folder="homepage"
                label="Hero Visual Image"
                customPrefix="hero_image"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={formData.hero.primaryCtaText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, primaryCtaText: e.target.value },
                  })
                }
                placeholder="Explore Products"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={formData.hero.primaryCtaLink}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, primaryCtaLink: e.target.value },
                  })
                }
                placeholder="/products"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Four Trust Indicators */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              Why Choose Us (4 Trust Cards)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formData.trustIndicators.map((item, idx) => (
              <div key={item.id || idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 uppercase">Card #{idx + 1}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Icon: {item.icon}</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...formData.trustIndicators];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, trustIndicators: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...formData.trustIndicators];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, trustIndicators: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: About Overview & CTA Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold font-display text-navy-900">
              About Section & CTA Banner
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About Section Heading
              </label>
              <input
                type="text"
                value={formData.aboutPreview.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPreview: { ...formData.aboutPreview, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About Description
              </label>
              <textarea
                rows={3}
                value={formData.aboutPreview.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPreview: { ...formData.aboutPreview, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bottom CTA Banner Title
              </label>
              <input
                type="text"
                value={formData.ctaBanner.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ctaBanner: { ...formData.ctaBanner, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bottom CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaBanner.buttonText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ctaBanner: { ...formData.ctaBanner, buttonText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
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
            <span>Save All Homepage Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
