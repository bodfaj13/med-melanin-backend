import { Request, Response } from 'express';
import { brochureContent } from '../data/brochure.data';
import { BrochureProgressService } from '../services/brochure-progress.service';

/**
 * @swagger
 * /api/v1/brochures/myomectomy:
 *   get:
 *     summary: Get full brochure content
 *     description: Retrieve the complete myomectomy aftercare brochure with all sections and content
 *     tags: [Brochure]
 *     responses:
 *       200:
 *         description: Brochure content retrieved successfully
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
 *                     $ref: '#/components/schemas/BrochureSection'
 *                 message:
 *                   type: string
 *                   example: Brochure content retrieved successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export const getBrochureContent = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: brochureContent,
      message: 'Brochure content retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve brochure content',
    });
  }
};

/**
 * @swagger
 * /api/v1/brochures/sections/{sectionId}:
 *   get:
 *     summary: Get specific brochure section
 *     description: Retrieve a specific section of the myomectomy aftercare brochure by section ID
 *     tags: [Brochure]
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section to retrieve
 *         example: activity-restrictions
 *     responses:
 *       200:
 *         description: Section retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrochureSection'
 *                 message:
 *                   type: string
 *                   example: Section retrieved successfully
 *       404:
 *         description: Section not found
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
export const getBrochureSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sectionId } = req.params;

    const section = brochureContent.find(section => section.id === sectionId);

    if (!section) {
      res.status(404).json({
        success: false,
        error: 'Section not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: section,
      message: 'Section retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve section',
    });
  }
};

/**
 * @swagger
 * /api/v1/brochures/sections:
 *   get:
 *     summary: Get brochure sections list with pagination
 *     description: Retrieve a paginated list of all available brochure sections
 *     tags: [Brochure]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for section title
 *     responses:
 *       200:
 *         description: Sections list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: activity-restrictions
 *                           title:
 *                             type: string
 *                             example: Activity Restrictions
 *                           contentCount:
 *                             type: number
 *                     totalDocs:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pagingCounter:
 *                       type: number
 *                     hasPrevPage:
 *                       type: boolean
 *                     hasNextPage:
 *                       type: boolean
 *                     prevPage:
 *                       type: number
 *                     nextPage:
 *                       type: number
 *                 message:
 *                   type: string
 *                   example: Brochure sections retrieved successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getBrochureSections = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Filter sections based on search
    let filteredSections = brochureContent;
    if (search) {
      filteredSections = brochureContent.filter(section =>
        section.title.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50); // Max 50 items per page
    const totalDocs = filteredSections.length;
    const totalPages = Math.ceil(totalDocs / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const docs = filteredSections.slice(startIndex, endIndex);

    // Transform sections
    const transformedDocs = docs.map(section => ({
      id: section.id,
      title: section.title,
      contentCount: section.content.length,
    }));

    res.status(200).json({
      success: true,
      data: {
        docs: transformedDocs,
        totalDocs,
        limit: limitNum,
        totalPages,
        page: pageNum,
        pagingCounter: startIndex + 1,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        nextPage: pageNum < totalPages ? pageNum + 1 : null,
      },
      message: 'Brochure sections retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve brochure sections',
    });
  }
};

/**
 * @swagger
 * /api/v1/brochures/progress:
 *   post:
 *     summary: Update brochure progress
 *     description: Update the completion status and notes for a specific brochure item
 *     tags: [Brochure]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sectionId
 *               - itemId
 *               - completed
 *             properties:
 *               sectionId:
 *                 type: string
 *                 description: The ID of the section
 *                 example: activity-restrictions
 *               itemId:
 *                 type: string
 *                 description: The ID of the item
 *                 example: no-driving
 *               completed:
 *                 type: boolean
 *                 description: Whether the item is completed
 *                 example: true
 *               notes:
 *                 type: string
 *                 description: Optional notes for the item
 *                 example: "Completed on day 3"
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrochureProgress'
 *                 message:
 *                   type: string
 *                   example: Progress updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const updateProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { sectionId, itemId, completed, notes } = req.body;

    if (!sectionId || !itemId || typeof completed !== 'boolean') {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: sectionId, itemId, completed',
      });
      return;
    }

    const result = await BrochureProgressService.updateProgress(
      userId,
      sectionId,
      itemId,
      completed,
      notes
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update progress',
    });
  }
};

/**
 * @swagger
 * /api/v1/brochures/progress:
 *   get:
 *     summary: Get user progress
 *     description: Retrieve all progress for the authenticated user
 *     tags: [Brochure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
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
 *                     $ref: '#/components/schemas/BrochureProgress'
 *                 message:
 *                   type: string
 *                   example: Progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getUserProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const result = await BrochureProgressService.getUserProgress(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress',
    });
  }
};

/**
 * @swagger
 * /api/v1/brochures/progress/reset:
 *   delete:
 *     summary: Reset user progress
 *     description: Delete all progress for the authenticated user
 *     tags: [Brochure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress reset successfully
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
 *                   example: Progress reset successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const resetProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const result = await BrochureProgressService.resetProgress(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reset progress',
    });
  }
};
