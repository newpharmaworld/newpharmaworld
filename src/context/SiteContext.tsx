import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { SiteSettings, HomepageContent } from '../types';
import { getSiteSettings, getHomepageContent } from '../firebase/firestore';
import { initialSiteSettings, initialHomepageContent } from '../firebase/seedData';

interface SiteContextType {
  settings: SiteSettings;
  homepage: HomepageContent;
  isLoading: boolean;
  refreshSiteData: () => Promise<void>;
  updateLocalSettings: (newSettings: Partial<SiteSettings>) => void;
  updateLocalHomepage: (newContent: Partial<HomepageContent>) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [homepage, setHomepage] = useState<HomepageContent>(initialHomepageContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchContent = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedHomepage] = await Promise.all([
        getSiteSettings(),
        getHomepageContent(),
      ]);
      setSettings(fetchedSettings);
      setHomepage(fetchedHomepage);
    } catch (err) {
      console.warn('Error fetching site data, fallback to defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateLocalSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateLocalHomepage = (newContent: Partial<HomepageContent>) => {
    setHomepage((prev) => ({ ...prev, ...newContent }));
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        homepage,
        isLoading,
        refreshSiteData: fetchContent,
        updateLocalSettings,
        updateLocalHomepage,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export function useSite(): SiteContextType {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
