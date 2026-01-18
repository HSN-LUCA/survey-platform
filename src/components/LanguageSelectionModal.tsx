'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface LanguageSelectionModalProps {
  onLanguageSelected: () => void;
}

export default function LanguageSelectionModal({
  onLanguageSelected,
}: LanguageSelectionModalProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already selected a language
    const hasSelectedLanguage = localStorage.getItem('languageSelected');
    if (hasSelectedLanguage) {
      setIsOpen(false);
      onLanguageSelected();
    }
  }, [onLanguageSelected]);

  const handleLanguageSelect = async (lang: 'en' | 'ar') => {
    setIsAnimating(true);
    await i18n.changeLanguage(lang);
    localStorage.setItem('languageSelected', 'true');
    localStorage.setItem('preferredLanguage', lang);
    
    // Small delay for animation
    setTimeout(() => {
      setIsOpen(false);
      onLanguageSelected();
    }, 300);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🌐</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">
            Select Language
          </h1>
          <p className="text-lg text-gray-600">
            اختر اللغة
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-4">
          {/* English Button */}
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            English
          </button>

          {/* Arabic Button */}
          <button
            onClick={() => handleLanguageSelect('ar')}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            العربية
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          You can change the language anytime using the language switcher
        </p>
      </div>
    </div>
  );
}
