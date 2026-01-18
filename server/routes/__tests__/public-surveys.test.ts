import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { generateToken } from '../../../lib/auth';

describe('Public Survey Routes', () => {
  let surveyId: string;
  const adminToken = generateToken('test-admin-id', 'admin@test.com');

  beforeAll(async () => {
    // Create a test survey
    const res = await request(app)
      .post('/api/admin/surveys')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title_ar: 'استبيان عام',
        title_en: 'Public Survey',
        description_ar: 'استبيان للمستخدمين العام',
        description_en: 'Survey for public users',
        customer_type: 'pilgrims',
        questions: [
          {
            type: 'multiple_choice',
            content_ar: 'كيف تقيم الخدمة؟',
            content_en: 'How do you rate the service?',
            required: true,
            options: [
              { text_ar: 'ممتازة', text_en: 'Excellent' },
              { text_ar: 'جيدة', text_en: 'Good' },
              { text_ar: 'متوسطة', text_en: 'Average' },
            ],
          },
          {
            type: 'star_rating',
            content_ar: 'قيم تجربتك',
            content_en: 'Rate your experience',
            required: true,
            star_count: 5,
            range_mappings: [
              { stars: 1, min_percentage: 0, max_percentage: 20 },
              { stars: 2, min_percentage: 21, max_percentage: 40 },
              { stars: 3, min_percentage: 41, max_percentage: 60 },
              { stars: 4, min_percentage: 61, max_percentage: 80 },
              { stars: 5, min_percentage: 81, max_percentage: 100 },
            ],
          },
          {
            type: 'percentage_range',
            content_ar: 'ما نسبة الرضا؟',
            content_en: 'What is your satisfaction percentage?',
            required: false,
            min: 0,
            max: 100,
            step: 5,
          },
        ],
      });

    surveyId = res.body.id;
  });

  describe('GET /api/surveys/:id', () => {
    it('should return survey without authentication', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(surveyId);
      expect(res.body.title_ar).toBe('استبيان عام');
      expect(res.body.title_en).toBe('Public Survey');
    });

    it('should return 404 if survey does not exist', async () => {
      const res = await request(app).get('/api/surveys/nonexistent-id');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Survey not found');
    });

    it('should include all questions with correct types', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      expect(res.status).toBe(200);
      expect(res.body.questions).toBeDefined();
      expect(res.body.questions.length).toBe(3);

      const types = res.body.questions.map((q: any) => q.type);
      expect(types).toContain('multiple_choice');
      expect(types).toContain('star_rating');
      expect(types).toContain('percentage_range');
    });

    it('should include options for multiple choice questions', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      const mcQuestion = res.body.questions.find((q: any) => q.type === 'multiple_choice');
      expect(mcQuestion).toBeDefined();
      expect(mcQuestion.options).toBeDefined();
      expect(mcQuestion.options.length).toBe(3);
      expect(mcQuestion.options[0]).toHaveProperty('text_ar');
      expect(mcQuestion.options[0]).toHaveProperty('text_en');
    });

    it('should include star config for star rating questions', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      const starQuestion = res.body.questions.find((q: any) => q.type === 'star_rating');
      expect(starQuestion).toBeDefined();
      expect(starQuestion.star_config).toBeDefined();
      expect(starQuestion.star_config.star_count).toBe(5);
      expect(starQuestion.star_config.range_mappings).toBeDefined();
      expect(starQuestion.star_config.range_mappings.length).toBe(5);
    });

    it('should include percentage config for percentage range questions', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      const percentQuestion = res.body.questions.find((q: any) => q.type === 'percentage_range');
      expect(percentQuestion).toBeDefined();
      expect(percentQuestion.percentage_config).toBeDefined();
      expect(percentQuestion.percentage_config.min).toBe(0);
      expect(percentQuestion.percentage_config.max).toBe(100);
      expect(percentQuestion.percentage_config.step).toBe(5);
    });

    it('should include bilingual content', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      expect(res.body.title_ar).toBeDefined();
      expect(res.body.title_en).toBeDefined();
      expect(res.body.description_ar).toBeDefined();
      expect(res.body.description_en).toBeDefined();

      res.body.questions.forEach((q: any) => {
        expect(q.content_ar).toBeDefined();
        expect(q.content_en).toBeDefined();
      });
    });

    it('should not include response_count in public response', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      expect(res.body).not.toHaveProperty('response_count');
    });

    it('should not include created_by in public response', async () => {
      const res = await request(app).get(`/api/surveys/${surveyId}`);

      expect(res.body).not.toHaveProperty('created_by');
    });
  });

  describe('POST /api/surveys/:id/responses', () => {
    let testSurveyId: string;

    beforeAll(async () => {
      // Create a test survey for responses
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان الإجابات',
          title_en: 'Response Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال 1',
              content_en: 'Question 1',
              required: true,
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
            {
              type: 'star_rating',
              content_ar: 'سؤال 2',
              content_en: 'Question 2',
              required: true,
              star_count: 5,
              range_mappings: [
                { stars: 1, min_percentage: 0, max_percentage: 20 },
                { stars: 5, min_percentage: 81, max_percentage: 100 },
              ],
            },
            {
              type: 'percentage_range',
              content_ar: 'سؤال 3',
              content_en: 'Question 3',
              required: false,
              min: 0,
              max: 100,
              step: 5,
            },
          ],
        });

      testSurveyId = res.body.id;
    });

    it('should return 404 if survey does not exist', async () => {
      const res = await request(app)
        .post('/api/surveys/nonexistent-id/responses')
        .send({
          answers: [],
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Survey not found');
    });

    it('should return 400 if answers is not an array', async () => {
      const res = await request(app)
        .post(`/api/surveys/${testSurveyId}/responses`)
        .send({
          answers: 'not an array',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('array');
    });

    it('should return 400 if required questions are missing', async () => {
      // Get survey to find question IDs
      const surveyRes = await request(app).get(`/api/surveys/${testSurveyId}`);
      const questions = surveyRes.body.questions;

      const res = await request(app)
        .post(`/api/surveys/${testSurveyId}/responses`)
        .send({
          answers: [
            {
              question_id: questions[0].id,
              value: questions[0].options[0].id,
            },
            // Missing required question 2
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should successfully submit survey with all required answers', async () => {
      // Get survey to find question IDs
      const surveyRes = await request(app).get(`/api/surveys/${testSurveyId}`);
      const questions = surveyRes.body.questions;

      const res = await request(app)
        .post(`/api/surveys/${testSurveyId}/responses`)
        .send({
          answers: [
            {
              question_id: questions[0].id,
              value: questions[0].options[0].id,
            },
            {
              question_id: questions[1].id,
              value: 5,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.response_id).toBeDefined();
    });

    it('should prevent duplicate submissions from same session', async () => {
      // Get survey to find question IDs
      const surveyRes = await request(app).get(`/api/surveys/${testSurveyId}`);
      const questions = surveyRes.body.questions;

      const answers = {
        answers: [
          {
            question_id: questions[0].id,
            value: questions[0].options[0].id,
          },
          {
            question_id: questions[1].id,
            value: 4,
          },
        ],
      };

      // First submission
      const res1 = await request(app)
        .post(`/api/surveys/${testSurveyId}/responses`)
        .send(answers);

      expect(res1.status).toBe(201);

      // Second submission from same session should fail
      const res2 = await request(app)
        .post(`/api/surveys/${testSurveyId}/responses`)
        .send(answers);

      expect(res2.status).toBe(409);
      expect(res2.body.error).toBe('Survey already submitted');
    });

    it('should accept optional questions being skipped', async () => {
      // Create a new survey with optional question
      const newSurveyRes = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان اختياري',
          title_en: 'Optional Survey',
          customer_type: 'staff',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال إجباري',
              content_en: 'Required Question',
              required: true,
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
            {
              type: 'multiple_choice',
              content_ar: 'سؤال اختياري',
              content_en: 'Optional Question',
              required: false,
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
          ],
        });

      const optionalSurveyId = newSurveyRes.body.id;

      // Get survey to find question IDs
      const surveyRes = await request(app).get(`/api/surveys/${optionalSurveyId}`);
      const questions = surveyRes.body.questions;

      // Submit only required question
      const res = await request(app)
        .post(`/api/surveys/${optionalSurveyId}/responses`)
        .send({
          answers: [
            {
              question_id: questions[0].id,
              value: questions[0].options[0].id,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });
});
