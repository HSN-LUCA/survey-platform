// Preset options for multiple choice questions
// Each option has English and Arabic versions

export interface PresetOption {
  id: string;
  text_en: string;
  text_ar: string;
}

export const PRESET_OPTIONS: PresetOption[] = [
  // Agreement/Satisfaction
  {
    id: 'strongly_agree',
    text_en: 'Strongly Agree',
    text_ar: 'أوافق بشدة',
  },
  {
    id: 'agree',
    text_en: 'Agree',
    text_ar: 'أوافق',
  },
  {
    id: 'neutral',
    text_en: 'Neutral',
    text_ar: 'محايد',
  },
  {
    id: 'disagree',
    text_en: 'Disagree',
    text_ar: 'لا أوافق',
  },
  {
    id: 'strongly_disagree',
    text_en: 'Strongly Disagree',
    text_ar: 'لا أوافق بشدة',
  },

  // Yes/No/Maybe
  {
    id: 'yes',
    text_en: 'Yes',
    text_ar: 'نعم',
  },
  {
    id: 'no',
    text_en: 'No',
    text_ar: 'لا',
  },
  {
    id: 'maybe',
    text_en: 'Maybe',
    text_ar: 'ربما',
  },

  // Satisfaction Levels
  {
    id: 'very_satisfied',
    text_en: 'Very Satisfied',
    text_ar: 'راضٍ جداً',
  },
  {
    id: 'satisfied',
    text_en: 'Satisfied',
    text_ar: 'راضٍ',
  },
  {
    id: 'somewhat_satisfied',
    text_en: 'Somewhat Satisfied',
    text_ar: 'راضٍ إلى حد ما',
  },
  {
    id: 'dissatisfied',
    text_en: 'Dissatisfied',
    text_ar: 'غير راضٍ',
  },
  {
    id: 'very_dissatisfied',
    text_en: 'Very Dissatisfied',
    text_ar: 'غير راضٍ جداً',
  },

  // Likelihood
  {
    id: 'very_likely',
    text_en: 'Very Likely',
    text_ar: 'محتمل جداً',
  },
  {
    id: 'likely',
    text_en: 'Likely',
    text_ar: 'محتمل',
  },
  {
    id: 'unlikely',
    text_en: 'Unlikely',
    text_ar: 'غير محتمل',
  },
  {
    id: 'very_unlikely',
    text_en: 'Very Unlikely',
    text_ar: 'غير محتمل جداً',
  },

  // Quality
  {
    id: 'excellent',
    text_en: 'Excellent',
    text_ar: 'ممتاز',
  },
  {
    id: 'good',
    text_en: 'Good',
    text_ar: 'جيد',
  },
  {
    id: 'fair',
    text_en: 'Fair',
    text_ar: 'مقبول',
  },
  {
    id: 'poor',
    text_en: 'Poor',
    text_ar: 'سيء',
  },

  // Frequency
  {
    id: 'always',
    text_en: 'Always',
    text_ar: 'دائماً',
  },
  {
    id: 'often',
    text_en: 'Often',
    text_ar: 'غالباً',
  },
  {
    id: 'sometimes',
    text_en: 'Sometimes',
    text_ar: 'أحياناً',
  },
  {
    id: 'rarely',
    text_en: 'Rarely',
    text_ar: 'نادراً',
  },
  {
    id: 'never',
    text_en: 'Never',
    text_ar: 'أبداً',
  },

  // Importance
  {
    id: 'very_important',
    text_en: 'Very Important',
    text_ar: 'مهم جداً',
  },
  {
    id: 'important',
    text_en: 'Important',
    text_ar: 'مهم',
  },
  {
    id: 'somewhat_important',
    text_en: 'Somewhat Important',
    text_ar: 'مهم إلى حد ما',
  },
  {
    id: 'not_important',
    text_en: 'Not Important',
    text_ar: 'غير مهم',
  },

  // Recommendation
  {
    id: 'would_recommend',
    text_en: 'Would Recommend',
    text_ar: 'سأوصي به',
  },
  {
    id: 'would_not_recommend',
    text_en: 'Would Not Recommend',
    text_ar: 'لن أوصي به',
  },

  // Service Quality
  {
    id: 'excellent_service',
    text_en: 'Excellent Service',
    text_ar: 'خدمة ممتازة',
  },
  {
    id: 'good_service',
    text_en: 'Good Service',
    text_ar: 'خدمة جيدة',
  },
  {
    id: 'average_service',
    text_en: 'Average Service',
    text_ar: 'خدمة متوسطة',
  },
  {
    id: 'poor_service',
    text_en: 'Poor Service',
    text_ar: 'خدمة سيئة',
  },
];

// Group options by category for easier selection
export const PRESET_OPTIONS_BY_CATEGORY = {
  agreement: [
    'strongly_agree',
    'agree',
    'neutral',
    'disagree',
    'strongly_disagree',
  ],
  yesNo: ['yes', 'no', 'maybe'],
  satisfaction: [
    'very_satisfied',
    'satisfied',
    'somewhat_satisfied',
    'dissatisfied',
    'very_dissatisfied',
  ],
  likelihood: ['very_likely', 'likely', 'unlikely', 'very_unlikely'],
  quality: ['excellent', 'good', 'fair', 'poor'],
  frequency: ['always', 'often', 'sometimes', 'rarely', 'never'],
  importance: [
    'very_important',
    'important',
    'somewhat_important',
    'not_important',
  ],
  recommendation: ['would_recommend', 'would_not_recommend'],
  service: [
    'excellent_service',
    'good_service',
    'average_service',
    'poor_service',
  ],
};

// Helper function to get option by ID
export const getPresetOptionById = (id: string): PresetOption | undefined => {
  return PRESET_OPTIONS.find((opt) => opt.id === id);
};

// Helper function to get options by category
export const getPresetOptionsByCategory = (
  category: keyof typeof PRESET_OPTIONS_BY_CATEGORY
): PresetOption[] => {
  const ids = PRESET_OPTIONS_BY_CATEGORY[category];
  return ids
    .map((id) => getPresetOptionById(id))
    .filter((opt) => opt !== undefined) as PresetOption[];
};
