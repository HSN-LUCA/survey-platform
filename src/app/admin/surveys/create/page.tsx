'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/AdminLayout';
import { v4 as uuidv4 } from 'uuid';
import {
  PRESET_OPTIONS,
  PRESET_OPTIONS_BY_CATEGORY,
  getPresetOptionsByCategory,
} from '@/config/presetOptions';

interface Option {
  id: string;
  text_en: string;
  text_ar: string;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'star_rating' | 'percentage_range' | 'text_box';
  content_en: string;
  content_ar: string;
  required: boolean;
  category?: string;
  options?: Option[];
}

export default function CreateSurveyPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [customerType, setCustomerType] = useState<'pilgrims' | 'staff'>('pilgrims');
  const isRTL = i18n.language === 'ar';

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'multiple_choice',
      content_en: '',
      content_ar: '',
      required: true,
      category: '',
      options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titleEn || !titleAr) {
      setError(t('validation.required'));
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    // Validate all questions have content
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.content_en || !q.content_ar) {
        setError(`Question ${i + 1}: Please enter content in both languages`);
        return;
      }
      if (q.type === 'multiple_choice' && (!q.options || q.options.length === 0)) {
        setError(`Question ${i + 1}: Please add at least one option for multiple choice questions`);
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title_en: titleEn,
          title_ar: titleAr,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          customer_type: customerType,
          questions,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        
        let errorMessage = 'Failed to create survey';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error('Survey creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          requestBody: {
            title_en: titleEn,
            title_ar: titleAr,
            description_en: descriptionEn,
            description_ar: descriptionAr,
            customer_type: customerType,
            questionsCount: questions.length,
          },
        });
        
        setError(errorMessage);
        return;
      }

      router.push('/admin/surveys');
    } catch (err) {
      console.error('Error creating survey:', err);
      const errorMessage = err instanceof Error ? err.message : t('errors.serverError');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={`max-w-6xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-2">
            {isRTL ? 'إنشاء استبيان جديد' : 'Create New Survey'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'أنشئ استبيانًا جديدًا بأسئلة متعددة اللغات' : 'Create a new survey with multi-language questions'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Survey Details Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isRTL ? 'تفاصيل الاستبيان' : 'Survey Details'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Customer Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {isRTL ? 'نوع العميل' : 'Customer Type'}
                </label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as 'pilgrims' | 'staff')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                >
                  <option value="pilgrims">{isRTL ? 'الحجاج' : 'Pilgrims'}</option>
                  <option value="staff">{isRTL ? 'موظفو الشركة' : 'Company Staff'}</option>
                </select>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isRTL ? 'العنوان (الإنجليزية)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                    placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isRTL ? 'العنوان (العربية)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                    placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
                    required
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isRTL ? 'الوصف (الإنجليزية)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                    rows={4}
                    placeholder={isRTL ? 'أدخل الوصف بالإنجليزية' : 'Enter description in English'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isRTL ? 'الوصف (العربية)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                    rows={4}
                    placeholder={isRTL ? 'أدخل الوصف بالعربية' : 'Enter description in Arabic'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isRTL ? 'الأسئلة' : 'Questions'}
                </h2>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>+</span>
                {isRTL ? 'إضافة سؤال' : 'Add Question'}
              </button>
            </div>

            <div className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">
                    {isRTL ? 'لم تضف أي أسئلة بعد. انقر على "إضافة سؤال" للبدء' : 'No questions added yet. Click "Add Question" to start'}
                  </p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg text-gray-800 bg-yellow-100 px-4 py-2 rounded-lg">
                        {isRTL ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                      >
                        {isRTL ? 'حذف' : 'Remove'}
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Question Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            {isRTL ? 'السؤال (الإنجليزية)' : 'Question (English)'}
                          </label>
                          <input
                            type="text"
                            value={question.content_en}
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                content_en: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            {isRTL ? 'السؤال (العربية)' : 'Question (Arabic)'}
                          </label>
                          <input
                            type="text"
                            value={question.content_ar}
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                content_ar: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Question Type and Required */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            {isRTL ? 'نوع السؤال' : 'Question Type'}
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                type: e.target.value as any,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                          >
                            <option value="multiple_choice">
                              {isRTL ? 'اختيار متعدد' : 'Multiple Choice'}
                            </option>
                            <option value="star_rating">
                              {isRTL ? 'تقييم بالنجوم' : 'Star Rating'}
                            </option>
                            <option value="percentage_range">
                              {isRTL ? 'نطاق النسبة المئوية' : 'Percentage Range'}
                            </option>
                            <option value="text_box">
                              {isRTL ? 'ملاحظات (نص حر)' : 'Notes (Free Text)'}
                            </option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) =>
                                updateQuestion(question.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="w-5 h-5 rounded border-gray-300 text-yellow-600 cursor-pointer"
                            />
                            <span className="font-semibold text-gray-700">
                              {isRTL ? 'مطلوب' : 'Required'}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          {isRTL ? 'الفئة (اختياري)' : 'Category (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={question.category || ''}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                          placeholder={isRTL ? 'مثال: جودة الخدمة' : 'Example: Service Quality'}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {isRTL ? 'استخدم نفس الفئة لتجميع الأسئلة ذات الصلة' : 'Use the same category to group related questions'}
                        </p>
                      </div>

                      {/* Options for Multiple Choice */}
                      {question.type === 'multiple_choice' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              {isRTL ? 'استخدام الخيارات المسبقة' : 'Use Preset Options'}
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const category = e.target.value as keyof typeof PRESET_OPTIONS_BY_CATEGORY;
                                  const presetOpts = getPresetOptionsByCategory(category);
                                  updateQuestion(question.id, {
                                    options: presetOpts,
                                  });
                                  e.target.value = '';
                                }
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all"
                            >
                              <option value="">
                                {isRTL ? '-- اختر فئة خيارات --' : '-- Select Option Category --'}
                              </option>
                              <option value="agreement">
                                {isRTL ? 'الموافقة' : 'Agreement'}
                              </option>
                              <option value="yesNo">
                                {isRTL ? 'نعم/لا' : 'Yes/No'}
                              </option>
                              <option value="satisfaction">
                                {isRTL ? 'الرضا' : 'Satisfaction'}
                              </option>
                              <option value="likelihood">
                                {isRTL ? 'الاحتمالية' : 'Likelihood'}
                              </option>
                              <option value="quality">
                                {isRTL ? 'الجودة' : 'Quality'}
                              </option>
                              <option value="frequency">
                                {isRTL ? 'التكرار' : 'Frequency'}
                              </option>
                              <option value="importance">
                                {isRTL ? 'الأهمية' : 'Importance'}
                              </option>
                              <option value="recommendation">
                                {isRTL ? 'التوصية' : 'Recommendation'}
                              </option>
                              <option value="service">
                                {isRTL ? 'جودة الخدمة' : 'Service Quality'}
                              </option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {isRTL
                                ? 'اختر فئة لتحميل الخيارات المسبقة بالعربية والإنجليزية'
                                : 'Select a category to load preset options in both languages'}
                            </p>
                          </div>

                          {/* Display Current Options */}
                          {question.options && question.options.length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-3">
                                {isRTL ? 'الخيارات الحالية' : 'Current Options'}
                              </h4>
                              <div className="space-y-2">
                                {question.options.map((opt, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between bg-white p-3 rounded border border-blue-100"
                                  >
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-800">
                                        {opt.text_en}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {opt.text_ar}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions = question.options?.filter(
                                          (_, i) => i !== idx
                                        );
                                        updateQuestion(question.id, {
                                          options: newOptions,
                                        });
                                      }}
                                      className="ml-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      {isRTL ? 'حذف' : 'Remove'}
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  updateQuestion(question.id, {
                                    options: [],
                                  });
                                }}
                                className="mt-3 w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
                              >
                                {isRTL ? 'مسح جميع الخيارات' : 'Clear All Options'}
                              </button>
                            </div>
                          )}

                          {/* Add Custom Option */}
                          <div className="border-t-2 border-gray-200 pt-4">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              {isRTL ? 'أو أضف خيار مخصص' : 'Or Add Custom Option'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                  {isRTL ? 'الخيار (الإنجليزية)' : 'Option (English)'}
                                </label>
                                <input
                                  type="text"
                                  id={`option-en-${question.id}`}
                                  placeholder={isRTL ? 'أدخل الخيار بالإنجليزية' : 'Enter option in English'}
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 bg-white text-black font-medium transition-all text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                  {isRTL ? 'الخيار (العربية)' : 'Option (Arabic)'}
                                </label>
                                <input
                                  type="text"
                                  id={`option-ar-${question.id}`}
                                  placeholder={isRTL ? 'أدخل الخيار بالعربية' : 'Enter option in Arabic'}
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-600 bg-white text-black font-medium transition-all text-sm"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const enInput = document.getElementById(
                                  `option-en-${question.id}`
                                ) as HTMLInputElement;
                                const arInput = document.getElementById(
                                  `option-ar-${question.id}`
                                ) as HTMLInputElement;

                                if (enInput.value.trim() && arInput.value.trim()) {
                                  const newOption: Option = {
                                    id: uuidv4(),
                                    text_en: enInput.value.trim(),
                                    text_ar: arInput.value.trim(),
                                  };
                                  const currentOptions = question.options || [];
                                  updateQuestion(question.id, {
                                    options: [...currentOptions, newOption],
                                  });
                                  enInput.value = '';
                                  arInput.value = '';
                                } else {
                                  alert(
                                    isRTL
                                      ? 'يرجى ملء كلا الحقلين'
                                      : 'Please fill both fields'
                                  );
                                }
                              }}
                              className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
                            >
                              {isRTL ? '+ إضافة خيار' : '+ Add Option'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isRTL ? 'جاري الإنشاء...' : 'Creating...'}
                </span>
              ) : (
                isRTL ? 'إنشاء الاستبيان' : 'Create Survey'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg text-lg"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
