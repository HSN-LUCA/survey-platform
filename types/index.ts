// Admin types
export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

// Survey types
export type CustomerType = 'pilgrims' | 'staff';
export type QuestionType = 'multiple_choice' | 'star_rating' | 'percentage_range' | 'text_box';

export interface Survey {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  customer_type: CustomerType;
  created_by?: string;
  created_at: Date;
  updated_at?: Date;
  is_archived?: boolean;
  response_count?: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  survey_id: string;
  type: QuestionType;
  content_ar: string;
  content_en: string;
  required: boolean;
  order_num: number;
  category?: string;
  options?: Option[];
  star_config?: StarRatingConfig;
  percentage_config?: PercentageConfig;
}

export interface Option {
  id: string;
  question_id: string;
  text_ar: string;
  text_en: string;
  order_num: number;
}

export interface StarRatingConfig {
  star_count: number;
  range_mappings: RangeMapping[];
}

export interface RangeMapping {
  stars: number;
  min_percentage: number;
  max_percentage: number;
}

export interface PercentageConfig {
  min: number;
  max: number;
  step: number;
}

// Response types
export interface Response {
  id: string;
  survey_id: string;
  user_session_id: string;
  submitted_at: Date;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  value: string | number;
}

export interface SubmitResponseRequest {
  answers: {
    question_id: string;
    value: string | number;
  }[];
}

// Analytics types
export interface QuestionAnalytics {
  question_id: string;
  type: QuestionType;
  content_ar: string;
  content_en: string;
  response_count: number;
  results: MultipleChoiceResults | StarRatingResults | PercentageResults;
}

export interface MultipleChoiceResults {
  type: 'multiple_choice';
  options: {
    option_id: string;
    text_ar: string;
    text_en: string;
    count: number;
    percentage: number;
  }[];
}

export interface StarRatingResults {
  type: 'star_rating';
  star_count: number;
  distribution: {
    stars: number;
    count: number;
    percentage: number;
    range_min: number;
    range_max: number;
  }[];
  average_rating: number;
}

export interface PercentageResults {
  type: 'percentage_range';
  average_percentage: number;
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface SurveyAnalytics {
  survey_id: string;
  response_count: number;
  submission_rate: number;
  questions: QuestionAnalytics[];
}

// JWT Payload
export interface JWTPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
