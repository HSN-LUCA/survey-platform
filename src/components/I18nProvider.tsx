'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import RtlWrapper from './RtlWrapper';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize i18n on client side only
    if (!i18n.isInitialized) {
      i18n.init().then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);

  // Suppress hydration warning for i18n provider
  if (!isReady) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <RtlWrapper>
        {children}
      </RtlWrapper>
    </I18nextProvider>
  );
}
