import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../../lib/db';
import { SubmitResponseRequest } from '../../types';

const router = Router();

/**
 * Generate or retrieve session ID from request
 * Uses a combination of IP and user agent for session tracking
 */
function getSessionId(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';
  // Create a simple hash-like session ID
  return Buffer.from(`${ip}:${userAgent}`).toString('base64');
}

/**
 * GET /api/surveys/:id
 * Get survey for user response (public, no authentication required)
 * Returns survey with all questions and options
 */
router.get('/:id', async (req: Request, res: Response) => {
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

    const response = {
      id: survey.id,
      title_ar: survey.title_ar,
      title_en: survey.title_en,
      description_ar: survey.description_ar,
      description_en: survey.description_en,
      customer_type: survey.customer_type,
      questions,
    };

    res.json(response);
  } catch (error) {
    console.error('Survey retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/surveys/:id/responses
 * Submit survey response
 * Validates all required questions are answered
 * Prevents duplicate submissions using session tracking
 */
router.post('/:id/responses', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body as SubmitResponseRequest;
    const sessionId = getSessionId(req);

    // Validate input
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        error: 'answers must be an array',
      });
    }

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

    // Get all questions for the survey
    const questionsResult = await query(
      `SELECT id, required FROM questions WHERE survey_id = $1`,
      [id]
    );

    const questions = questionsResult.rows;
    const requiredQuestionIds = questions.filter((q) => q.required).map((q) => q.id);

    // Validate all required questions are answered
    const answeredQuestionIds = answers.map((a) => a.question_id);
    const missingRequired = requiredQuestionIds.filter((id) => !answeredQuestionIds.includes(id));

    if (missingRequired.length > 0) {
      return res.status(400).json({
        error: 'All required questions must be answered',
        missing_questions: missingRequired,
      });
    }

    // Check for duplicate submission
    const duplicateResult = await query(
      `SELECT id FROM responses WHERE survey_id = $1 AND user_session_id = $2`,
      [id, sessionId]
    );

    if (duplicateResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Survey already submitted',
      });
    }

    // Create response in transaction
    const responseId = await transaction(async (client) => {
      const newResponseId = uuidv4();

      // Insert response
      await client.query(
        `INSERT INTO responses (id, survey_id, user_session_id) VALUES ($1, $2, $3)`,
        [newResponseId, id, sessionId]
      );

      // Insert answers
      for (const answer of answers) {
        await client.query(
          `INSERT INTO answers (id, response_id, question_id, value) VALUES ($1, $2, $3, $4)`,
          [uuidv4(), newResponseId, answer.question_id, String(answer.value)]
        );
      }

      return newResponseId;
    });

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      response_id: responseId,
    });
  } catch (error) {
    console.error('Response submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
