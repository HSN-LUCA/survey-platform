'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: 'surveys' | 'analytics' | 'settings';
}

export default function AdminLayout({ children, activeTab = 'surveys' }: AdminLayoutProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const navItems = [
    { id: 'analytics', label: t('admin.analytics'), href: '/admin/analytics' },
    { id: 'surveys', label: t('admin.surveys'), href: '/admin/surveys' },
    { id: 'settings', label: t('admin.settings'), href: '/admin/settings' },
  ];

  return (
    <div className={`flex h-screen bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-yellow-600 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-yellow-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-2xl' : 'text-lg'}`}>
            {sidebarOpen ? 'Survey' : 'S'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-yellow-700 text-white'
                  : 'text-yellow-100 hover:bg-yellow-700'
              }`}
            >
              <span className="text-xl">
                {item.id === 'surveys' && '📋'}
                {item.id === 'analytics' && '📊'}
                {item.id === 'settings' && '⚙️'}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-yellow-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-yellow-100 hover:bg-yellow-700 transition-colors"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>{t('admin.logout')}</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-yellow-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-yellow-100 hover:bg-yellow-700 transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'surveys' && t('admin.surveys')}
            {activeTab === 'analytics' && t('admin.analytics')}
            {activeTab === 'settings' && t('admin.settings')}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-xl transition-colors">
              🔔
            </button>
            <button className="text-gray-600 hover:text-gray-900 text-xl transition-colors">
              👤
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => {
                const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
                i18n.changeLanguage(newLanguage);
                localStorage.setItem('language', newLanguage);
                document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = newLanguage;
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
              title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
