import { Request, Response } from 'express';
import {
  SymptomEntryService,
  SymptomEntryRequest,
} from '../services/symptom-entry.service';

/**
 * @swagger
 * /api/v1/tracker:
 *   post:
 *     summary: Create a new symptom entry
 *     description: Create a new symptom entry for the authenticated user
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - painLevel
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Date of the symptom entry
 *               painLevel:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 5
 *                 description: Pain level from 1-10
 *               location:
 *                 type: string
 *                 example: "Lower abdomen"
 *                 description: Location of the pain or symptom
 *               description:
 *                 type: string
 *                 example: "Sharp pain in lower abdomen, worse when moving"
 *                 description: Detailed description of symptoms
 *               medications:
 *                 type: string
 *                 example: "Ibuprofen 400mg"
 *                 description: Medications taken for the symptoms
 *     responses:
 *       201:
 *         description: Symptom entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SymptomEntry'
 *                 message:
 *                   type: string
 *                   example: "Symptom entry created successfully"
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createSymptomEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    const entryData: SymptomEntryRequest = {
      date: req.body.date,
      painLevel: req.body.painLevel,
      location: req.body.location || '',
      description: req.body.description || '',
      medications: req.body.medications || '',
    };

    const result = await SymptomEntryService.createEntry(userId, entryData);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in createSymptomEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /api/v1/tracker:
 *   get:
 *     summary: Get all symptom entries for user
 *     description: Retrieve all symptom entries for the authenticated user
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter entries from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter entries until this date (YYYY-MM-DD)
 *       - in: query
 *         name: painLevel
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *         description: Filter by pain level
 *     responses:
 *       200:
 *         description: Symptom entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SymptomEntry'
 *                 message:
 *                   type: string
 *                   example: "Symptom entries retrieved successfully"
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getUserSymptomEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    const result = await SymptomEntryService.getUserEntries(userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in getUserSymptomEntries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /api/v1/tracker/{id}:
 *   put:
 *     summary: Update a symptom entry
 *     description: Update an existing symptom entry for the authenticated user
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Symptom entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Date of the symptom entry
 *               painLevel:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 6
 *                 description: Pain level from 1-10
 *               location:
 *                 type: string
 *                 example: "Lower abdomen"
 *                 description: Location of the pain or symptom
 *               description:
 *                 type: string
 *                 example: "Sharp pain in lower abdomen, worse when moving"
 *                 description: Detailed description of symptoms
 *               medications:
 *                 type: string
 *                 example: "Ibuprofen 400mg"
 *                 description: Medications taken for the symptoms
 *     responses:
 *       200:
 *         description: Symptom entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SymptomEntry'
 *                 message:
 *                   type: string
 *                   example: "Symptom entry updated successfully"
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Symptom entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateSymptomEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    const entryId = req.params.id;
    const updateData: Partial<SymptomEntryRequest> = {
      ...(req.body.date && { date: req.body.date }),
      ...(req.body.painLevel !== undefined && {
        painLevel: req.body.painLevel,
      }),
      ...(req.body.location !== undefined && { location: req.body.location }),
      ...(req.body.description !== undefined && {
        description: req.body.description,
      }),
      ...(req.body.medications !== undefined && {
        medications: req.body.medications,
      }),
    };

    const result = await SymptomEntryService.updateEntry(
      userId,
      entryId,
      updateData
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in updateSymptomEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /api/v1/tracker/{id}:
 *   delete:
 *     summary: Delete a symptom entry
 *     description: Delete a specific symptom entry for the authenticated user
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Symptom entry ID
 *     responses:
 *       200:
 *         description: Symptom entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Symptom entry deleted successfully"
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Symptom entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteSymptomEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    const entryId = req.params.id;
    const result = await SymptomEntryService.deleteEntry(userId, entryId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in deleteSymptomEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /api/v1/tracker/clear:
 *   delete:
 *     summary: Clear all symptom entries for user
 *     description: Delete all symptom entries for the authenticated user
 *     tags: [Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All symptom entries cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All symptom entries cleared successfully"
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const clearUserSymptomEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }

    const result = await SymptomEntryService.clearUserEntries(userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in clearUserSymptomEntries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
