import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../../lib/db';
import { authMiddleware } from '../middleware/auth';
import { Survey, Question, Option, RangeMapping } from '../../types';

const router = Router();

/**
 * GET /api/admin/surveys
 * List all surveys with optional filtering by customer type
 * Protected route - requires JWT authentication
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { customer_type, search } = req.query;

    let sql = `
      SELECT 
        s.id,
        s.title_ar,
        s.title_en,
        s.description_ar,
        s.description_en,
        s.customer_type,
        s.created_by,
        s.created_at,
        s.updated_at,
        s.is_archived,
        COUNT(r.id) as response_count
      FROM surveys s
      LEFT JOIN responses r ON s.id = r.survey_id
      WHERE s.is_archived = FALSE
    `;

    const params: any[] = [];

    // Filter by customer type
    if (customer_type && ['pilgrims', 'staff'].includes(customer_type as string)) {
      sql += ` AND s.customer_type = $${params.length + 1}`;
      params.push(customer_type);
    }

    // Search by title or description
    if (search) {
      sql += ` AND (s.title_ar ILIKE $${params.length + 1} OR s.title_en ILIKE $${params.length + 1} OR s.description_ar ILIKE $${params.length + 1} OR s.description_en ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    sql += ` GROUP BY s.id ORDER BY s.created_at DESC`;

    const result = await query(sql, params);

    const surveys = result.rows.map((row) => ({
      id: row.id,
      title_ar: row.title_ar,
      title_en: row.title_en,
      description_ar: row.description_ar,
      description_en: row.description_en,
      customer_type: row.customer_type,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_archived: row.is_archived,
      response_count: parseInt(row.response_count),
    }));

    res.json(surveys);
  } catch (error) {
    console.error('Survey list error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/admin/surveys/:id
 * Get survey details with all questions and options
 * Protected route - requires JWT authentication
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get survey
    const surveyResult = await query(
      `SELECT * FROM surveys WHERE id = $1 AND is_archived = FALSE`,
      [id]
    );

    if (surveyResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Survey not found',
      });
    }

    const survey = surveyResult.rows[0];

    // Get questions
    const questionsResult = await query(
      `SELECT * FROM questions WHERE survey_id = $1 ORDER BY order_num ASC`,
      [id]
    );

    const questions = await Promise.all(
      questionsResult.rows.map(async (q) => {
        const questionData: any = {
          id: q.id,
          survey_id: q.survey_id,
          type: q.type,
          content_ar: q.content_ar,
          content_en: q.content_en,
          required: q.required,
          order_num: q.order_num,
        };

        // Get options for multiple choice
        if (q.type === 'multiple_choice') {
          const optionsResult = await query(
            `SELECT * FROM options WHERE question_id = $1 ORDER BY order_num ASC`,
            [q.id]
          );
          questionData.options = optionsResult.rows.map((o) => ({
            id: o.id,
            question_id: o.question_id,
            text_ar: o.text_ar,
            text_en: o.text_en,
            order_num: o.order_num,
          }));
        }

        // Get star config
        if (q.type === 'star_rating') {
          questionData.star_config = {
            star_count: q.star_count,
            range_mappings: [],
          };

          const mappingsResult = await query(
            `SELECT * FROM star_range_mappings WHERE question_id = $1 ORDER BY star_level ASC`,
            [q.id]
          );
          questionData.star_config.range_mappings = mappingsResult.rows.map((m) => ({
            stars: m.star_level,
            min_percentage: m.min_percentage,
            max_percentage: m.max_percentage,
          }));
        }

        // Get percentage config
        if (q.type === 'percentage_range') {
          questionData.percentage_config = {
            min: q.percentage_min,
            max: q.percentage_max,
            step: q.percentage_step,
          };
        }

        return questionData;
      })
    );

    // Get response count
    const responseCountResult = await query(
      `SELECT COUNT(*) as count FROM responses WHERE survey_id = $1`,
      [id]
    );

    const responseCount = parseInt(responseCountResult.rows[0].count);

    const response = {
      id: survey.id,
      title_ar: survey.title_ar,
      title_en: survey.title_en,
      description_ar: survey.description_ar,
      description_en: survey.description_en,
      customer_type: survey.customer_type,
      created_by: survey.created_by,
      created_at: survey.created_at,
      updated_at: survey.updated_at,
      is_archived: survey.is_archived,
      response_count: responseCount,
      questions,
    };

    res.json(response);
  } catch (error) {
    console.error('Survey detail error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/admin/surveys
 * Create a new survey with questions and options
 * Protected route - requires JWT authentication
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title_ar,
      title_en,
      description_ar,
      description_en,
      customer_type,
      questions: questionsData,
    } = req.body;

    // Validate required fields
    if (!title_ar || !title_en || !customer_type) {
      return res.status(400).json({
        error: 'title_ar, title_en, and customer_type are required',
      });
    }

    if (!['pilgrims', 'staff'].includes(customer_type)) {
      return res.status(400).json({
        error: 'customer_type must be either "pilgrims" or "staff"',
      });
    }

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(400).json({
        error: 'At least one question is required',
      });
    }

    // Validate questions
    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      if (!q.type || !q.content_ar || !q.content_en) {
        return res.status(400).json({
          error: `Question ${i + 1}: type, content_ar, and content_en are required`,
        });
      }

      if (!['multiple_choice', 'star_rating', 'percentage_range'].includes(q.type)) {
        return res.status(400).json({
          error: `Question ${i + 1}: invalid type`,
        });
      }

      // Validate multiple choice questions
      if (q.type === 'multiple_choice') {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          return res.status(400).json({
            error: `Question ${i + 1}: multiple_choice requires at least 2 options`,
          });
        }
        for (const opt of q.options) {
          if (!opt.text_ar || !opt.text_en) {
            return res.status(400).json({
              error: `Question ${i + 1}: all options must have text_ar and text_en`,
            });
          }
        }
      }

      // Validate star rating questions
      if (q.type === 'star_rating') {
        if (!q.star_count || q.star_count < 1 || q.star_count > 5) {
          return res.status(400).json({
            error: `Question ${i + 1}: star_count must be between 1 and 5`,
          });
        }
        if (Array.isArray(q.range_mappings)) {
          for (const mapping of q.range_mappings) {
            if (
              mapping.stars === undefined ||
              mapping.min_percentage === undefined ||
              mapping.max_percentage === undefined
            ) {
              return res.status(400).json({
                error: `Question ${i + 1}: range_mappings must have stars, min_percentage, and max_percentage`,
              });
            }
          }
        }
      }

      // Validate percentage range questions
      if (q.type === 'percentage_range') {
        if (q.min === undefined || q.max === undefined) {
          return res.status(400).json({
            error: `Question ${i + 1}: percentage_range requires min and max`,
          });
        }
      }
    }

    // Create survey in transaction
    const result = await transaction(async (client) => {
      const surveyId = uuidv4();

      // Insert survey
      await client.query(
        `INSERT INTO surveys (id, title_ar, title_en, description_ar, description_en, customer_type, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          surveyId,
          title_ar,
          title_en,
          description_ar || '',
          description_en || '',
          customer_type,
          req.admin!.id,
        ]
      );

      // Insert questions and options
      for (let qIndex = 0; qIndex < questionsData.length; qIndex++) {
        const q = questionsData[qIndex];
        const questionId = uuidv4();

        await client.query(
          `INSERT INTO questions (id, survey_id, type, content_ar, content_en, required, order_num, star_count, percentage_min, percentage_max, percentage_step)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            questionId,
            surveyId,
            q.type,
            q.content_ar,
            q.content_en,
            q.required !== false,
            qIndex,
            q.star_count || null,
            q.min || 0,
            q.max || 100,
            q.step || 5,
          ]
        );

        // Insert options for multiple choice
        if (q.type === 'multiple_choice' && Array.isArray(q.options)) {
          for (let oIndex = 0; oIndex < q.options.length; oIndex++) {
            const opt = q.options[oIndex];
            await client.query(
              `INSERT INTO options (id, question_id, text_ar, text_en, order_num)
               VALUES ($1, $2, $3, $4, $5)`,
              [uuidv4(), questionId, opt.text_ar, opt.text_en, oIndex]
            );
          }
        }

        // Insert star range mappings
        if (q.type === 'star_rating' && Array.isArray(q.range_mappings)) {
          for (const mapping of q.range_mappings) {
            await client.query(
              `INSERT INTO star_range_mappings (id, question_id, star_level, min_percentage, max_percentage)
               VALUES ($1, $2, $3, $4, $5)`,
              [uuidv4(), questionId, mapping.stars, mapping.min_percentage, mapping.max_percentage]
            );
          }
        }
      }

      return surveyId;
    });

    res.status(201).json({
      id: result,
      title_ar,
      title_en,
      customer_type,
      message: 'Survey created successfully',
    });
  } catch (error) {
    console.error('Survey creation error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
