'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Country {
  code: string;
  name: string;
  name_en: string;
  name_ar: string;
}

export interface UserDetails {
  email: string;
  hajjNumber: string;
  gender: string;
  ageRange: string;
  educationLevel: string;
  nationality: string;
}

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
  isRTL: boolean;
}

export default function UserDetailsForm({ onSubmit, isRTL }: UserDetailsFormProps) {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<UserDetails>({
    email: '',
    hajjNumber: '',
    gender: '',
    ageRange: '',
    educationLevel: '',
    nationality: i18n.language === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  // Fetch countries on mount and when language changes
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`/api/countries?language=${i18n.language}`);
        if (response.ok) {
          const data = await response.json();
          setAllCountries(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, [i18n.language]);

  // Update default nationality when language changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nationality: i18n.language === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates',
    }));
  }, [i18n.language]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    if (!formData.hajjNumber) {
      newErrors.hajjNumber = t('validation.required');
    }

    if (!formData.gender) {
      newErrors.gender = t('validation.required');
    }

    if (!formData.ageRange) {
      newErrors.ageRange = t('validation.required');
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = t('validation.required');
    }

    if (!formData.nationality) {
      newErrors.nationality = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-yellow-900 mb-2">
              {t('survey.userDetails')}
            </h1>
            <p className="text-gray-600">
              {t('survey.userDetailsDescription')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.email')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black placeholder-gray-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Hajj Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.hajjNumber')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="hajjNumber"
                value={formData.hajjNumber}
                onChange={handleChange}
                placeholder={t('survey.hajjNumberPlaceholder')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black placeholder-gray-500 ${
                  errors.hajjNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hajjNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.hajjNumber}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.gender')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('survey.selectOption')}</option>
                <option value="male">{t('survey.male')}</option>
                <option value="female">{t('survey.female')}</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.ageRange')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black ${
                  errors.ageRange ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('survey.selectOption')}</option>
                <option value="8-29">{t('survey.age8to29')}</option>
                <option value="30-39">{t('survey.age30to39')}</option>
                <option value="40-55">{t('survey.age40to55')}</option>
                <option value="56-60">{t('survey.age56to60')}</option>
                <option value="60+">{t('survey.age60plus')}</option>
              </select>
              {errors.ageRange && (
                <p className="text-red-600 text-sm mt-1">{errors.ageRange}</p>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.educationLevel')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black ${
                  errors.educationLevel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('survey.selectOption')}</option>
                <option value="primary">{t('survey.primary')}</option>
                <option value="secondary">{t('survey.secondary')}</option>
                <option value="diploma">{t('survey.diploma')}</option>
                <option value="bachelor">{t('survey.bachelor')}</option>
                <option value="master">{t('survey.master')}</option>
                <option value="phd">{t('survey.phd')}</option>
              </select>
              {errors.educationLevel && (
                <p className="text-red-600 text-sm mt-1">{errors.educationLevel}</p>
              )}
            </div>

            {/* Nationality Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('survey.nationality')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-black ${
                  errors.nationality ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('survey.selectOption')}</option>
                {allCountries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              {errors.nationality && (
                <p className="text-red-600 text-sm mt-1">{errors.nationality}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {t('survey.startSurvey')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
