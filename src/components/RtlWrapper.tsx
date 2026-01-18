'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RtlWrapperProps {
  children: React.ReactNode;
}

export default function RtlWrapper({ children }: RtlWrapperProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isArabic = i18n.language === 'ar';
    const htmlElement = document.documentElement;
    
    if (isArabic) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ar');
      document.body.style.direction = 'rtl';
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
      document.body.style.direction = 'ltr';
    }
  }, [i18n.language]);

  return <>{children}</>;
}
