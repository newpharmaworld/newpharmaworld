import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Database,
  Key,
  Copy,
  Check,
  HardDrive,
  Info,
  RefreshCw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { seedInitialDatabase } from '../../firebase/firestore';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedStorage, setCopiedStorage] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /specialities/{specialityId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /brands/{brandId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /homepage/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /siteSettings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /enquiries/{enquiryId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}`;

  const storageRulesText = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null;
    }
    match /{folder}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 5 * 1024 * 1024;
    }
  }
}`;

  const handleCopy = (text: string, isStorage = false) => {
    navigator.clipboard.writeText(text);
    if (isStorage) {
      setCopiedStorage(true);
      setTimeout(() => setCopiedStorage(false), 2500);
    } else {
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2500);
    }
    success('Security rules copied to clipboard!');
  };

  const handleReseed = async () => {
    if (!window.confirm('This will write the standard seed data (6 Specialities, 8 Brands, Demo Products, Site Settings) to Firestore. Continue?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const res = await seedInitialDatabase();
      if (res.success) {
        success(res.message);
      } else {
        error(res.message);
      }
    } catch (err: any) {
      error(err.message || 'Seeding error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold font-display text-navy-900">
          Database Tools & Security Rules
        </h1>
        <p className="text-xs text-slate-500">
          Manage Firestore rules, storage quotas, Spark free-plan health, and seed actions
        </p>
      </div>

      {/* Admin Session Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold font-display text-navy-900">
            Authenticated Administrator
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block uppercase font-semibold text-[10px]">Admin Email</span>
            <span className="font-bold text-navy-900 text-sm">{user?.email || 'Authenticated'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block uppercase font-semibold text-[10px]">Firebase UID</span>
            <span className="font-mono text-slate-600 truncate block">{user?.uid || 'Active Session'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block uppercase font-semibold text-[10px]">Plan Type</span>
            <span className="font-bold text-emerald-700">Firebase Spark (100% Free)</span>
          </div>
        </div>
      </div>

      {/* 1-Click Database Reset / Seeding */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Database className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold font-display text-navy-900">
            Data Initializer & Seeder
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Use this button whenever you want to reset or initialize default baseline data (Transplant, Dialysis, Vaccines, Cancer Care, Fertility, General Medicine categories, Cipla, Sun Pharma, Dr. Reddy's, Lupin, Zydus, Mankind, Intas, Abbott brands, demo products, and Kodambakkam contact details).
        </p>

        <div>
          <button
            onClick={handleReseed}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Writing to Cloud Firestore...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-teal-400" />
                <span>Seed / Reset Default Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Firestore Security Rules Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold font-display text-navy-900">
              Cloud Firestore Security Rules (`firestore.rules`)
            </h2>
          </div>
          <button
            onClick={() => handleCopy(firestoreRulesText)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRules ? 'Copied' : 'Copy Rules'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Paste these rules in your <strong>Firebase Console &gt; Firestore Database &gt; Rules</strong> tab to protect database modifications:
        </p>

        <pre className="p-4 bg-navy-950 text-teal-300 font-mono text-xs rounded-2xl overflow-x-auto border border-navy-800">
          {firestoreRulesText}
        </pre>
      </div>

      {/* Storage Security Rules Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold font-display text-navy-900">
              Firebase Storage Security Rules (`storage.rules`)
            </h2>
          </div>
          <button
            onClick={() => handleCopy(storageRulesText, true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {copiedStorage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedStorage ? 'Copied' : 'Copy Rules'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Paste these in <strong>Firebase Console &gt; Storage &gt; Rules</strong> to ensure public image reading and admin-only optimized uploads:
        </p>

        <pre className="p-4 bg-navy-950 text-teal-300 font-mono text-xs rounded-2xl overflow-x-auto border border-navy-800">
          {storageRulesText}
        </pre>
      </div>
    </div>
  );
};
