import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { query } from '../../../lib/db';
import { generateToken } from '../../../lib/auth';

describe('Survey Routes', () => {
  let adminToken: string;
  const adminId = 'test-admin-id-surveys';
  const adminEmail = 'survey-admin@test.com';
  let createdSurveyId: string;

  beforeAll(async () => {
    // Create test admin
    adminToken = generateToken(adminId, adminEmail);
  });

  describe('GET /api/admin/surveys/:id', () => {
    let surveyId: string;

    beforeAll(async () => {
      // Create a test survey
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان التفاصيل',
          title_en: 'Detail Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال متعدد الخيارات',
              content_en: 'Multiple choice question',
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
            {
              type: 'star_rating',
              content_ar: 'سؤال التقييم',
              content_en: 'Rating question',
              star_count: 5,
              range_mappings: [
                { stars: 1, min_percentage: 0, max_percentage: 20 },
                { stars: 5, min_percentage: 81, max_percentage: 100 },
              ],
            },
          ],
        });

      surveyId = res.body.id;
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get(`/api/admin/surveys/${surveyId}`);

      expect(res.status).toBe(401);
    });

    it('should return 404 if survey does not exist', async () => {
      const res = await request(app)
        .get('/api/admin/surveys/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Survey not found');
    });

    it('should return survey with all questions and options', async () => {
      const res = await request(app)
        .get(`/api/admin/surveys/${surveyId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(surveyId);
      expect(res.body.title_ar).toBe('استبيان التفاصيل');
      expect(res.body.title_en).toBe('Detail Survey');
      expect(res.body.questions).toBeDefined();
      expect(res.body.questions.length).toBe(2);
      expect(res.body.response_count).toBe(0);
    });

    it('should include options for multiple choice questions', async () => {
      const res = await request(app)
        .get(`/api/admin/surveys/${surveyId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const mcQuestion = res.body.questions.find((q: any) => q.type === 'multiple_choice');
      expect(mcQuestion).toBeDefined();
      expect(mcQuestion.options).toBeDefined();
      expect(mcQuestion.options.length).toBe(2);
      expect(mcQuestion.options[0].text_ar).toBe('خيار 1');
    });

    it('should include star config for star rating questions', async () => {
      const res = await request(app)
        .get(`/api/admin/surveys/${surveyId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const starQuestion = res.body.questions.find((q: any) => q.type === 'star_rating');
      expect(starQuestion).toBeDefined();
      expect(starQuestion.star_config).toBeDefined();
      expect(starQuestion.star_config.star_count).toBe(5);
      expect(starQuestion.star_config.range_mappings.length).toBe(2);
    });
  });

  describe('GET /api/admin/surveys', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/admin/surveys');

      expect(res.status).toBe(401);
    });

    it('should return empty array if no surveys exist', async () => {
      const res = await request(app)
        .get('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should filter surveys by customer type', async () => {
      // Create a pilgrim survey
      await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان الحج',
          title_en: 'Hajj Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال',
              content_en: 'Question',
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
          ],
        });

      // Create a staff survey
      await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان الموظفين',
          title_en: 'Staff Survey',
          customer_type: 'staff',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال',
              content_en: 'Question',
              options: [
                { text_ar: 'خيار 1', text_en: 'Option 1' },
                { text_ar: 'خيار 2', text_en: 'Option 2' },
              ],
            },
          ],
        });

      // Get pilgrim surveys
      const pilgrimRes = await request(app)
        .get('/api/admin/surveys?customer_type=pilgrims')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(pilgrimRes.status).toBe(200);
      expect(pilgrimRes.body.every((s: any) => s.customer_type === 'pilgrims')).toBe(true);

      // Get staff surveys
      const staffRes = await request(app)
        .get('/api/admin/surveys?customer_type=staff')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(staffRes.status).toBe(200);
      expect(staffRes.body.every((s: any) => s.customer_type === 'staff')).toBe(true);
    });

    it('should search surveys by title', async () => {
      const res = await request(app)
        .get('/api/admin/surveys?search=Hajj')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.some((s: any) => s.title_en.includes('Hajj'))).toBe(true);
    });

    it('should include response count in survey list', async () => {
      const res = await request(app)
        .get('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('response_count');
        expect(typeof res.body[0].response_count).toBe('number');
      }
    });
  });
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [],
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          // missing title_en
          customer_type: 'pilgrims',
          questions: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should return 400 if customer_type is invalid', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'invalid',
          questions: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('pilgrims');
    });

    it('should return 400 if no questions provided', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('At least one question');
    });

    it('should create survey with multiple choice question', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان الحج',
          title_en: 'Hajj Survey',
          description_ar: 'استبيان عن تجربة الحج',
          description_en: 'Survey about Hajj experience',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'كيف كانت تجربتك؟',
              content_en: 'How was your experience?',
              required: true,
              options: [
                { text_ar: 'ممتازة', text_en: 'Excellent' },
                { text_ar: 'جيدة', text_en: 'Good' },
                { text_ar: 'متوسطة', text_en: 'Average' },
              ],
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title_ar).toBe('استبيان الحج');
      expect(res.body.title_en).toBe('Hajj Survey');
      expect(res.body.customer_type).toBe('pilgrims');
    });

    it('should create survey with star rating question', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان التقييم',
          title_en: 'Rating Survey',
          customer_type: 'staff',
          questions: [
            {
              type: 'star_rating',
              content_ar: 'قيم الخدمة',
              content_en: 'Rate the service',
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
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it('should create survey with percentage range question', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان النسبة',
          title_en: 'Percentage Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'percentage_range',
              content_ar: 'ما نسبة الرضا؟',
              content_en: 'What is your satisfaction percentage?',
              required: true,
              min: 0,
              max: 100,
              step: 5,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 if multiple choice has less than 2 options', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال',
              content_en: 'Question',
              options: [{ text_ar: 'خيار', text_en: 'Option' }],
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('at least 2 options');
    });

    it('should return 400 if star_count is invalid', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'star_rating',
              content_ar: 'سؤال',
              content_en: 'Question',
              star_count: 10,
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('between 1 and 5');
    });
  });

  describe('POST /api/admin/surveys', () => {
    it('should return 400 if multiple choice has less than 2 options', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'multiple_choice',
              content_ar: 'سؤال',
              content_en: 'Question',
              options: [{ text_ar: 'خيار', text_en: 'Option' }],
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('at least 2 options');
    });

    it('should return 400 if star_count is invalid', async () => {
      const res = await request(app)
        .post('/api/admin/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title_ar: 'استبيان',
          title_en: 'Survey',
          customer_type: 'pilgrims',
          questions: [
            {
              type: 'star_rating',
              content_ar: 'سؤال',
              content_en: 'Question',
              star_count: 10,
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('between 1 and 5');
    });
  });
});
