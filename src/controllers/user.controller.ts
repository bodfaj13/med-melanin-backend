import { Request, Response } from 'express';
import { User } from '../models/user.model';

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users with pagination
 *     description: Retrieve a paginated list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for first name, last name or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, email, createdAt, surgeryDate]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           surgeryDate:
 *                             type: string
 *                             format: date
 *                           recoveryDay:
 *                             type: number
 *                           createdAt:
 *                             type: string
 *                             format: date
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
 *                   example: "Users retrieved successfully"
 *       401:
 *         description: Unauthorized
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
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Pagination options
    const options = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100), // Max 100 items per page
      sort,
      select: '-password', // Exclude password
    };

    const result = await User.paginate(query, options);

    // Transform the response
    const transformedDocs = result.docs.map(
      (user: {
        _id: { toString: () => string };
        firstName: string;
        lastName: string;
        email: string;
        surgeryDate?: Date;
        calculateRecoveryDay: () => number;
        createdAt: Date;
      }) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        surgeryDate: user.surgeryDate,
        recoveryDay: user.calculateRecoveryDay(),
        createdAt: user.createdAt,
      })
    );

    res.status(200).json({
      success: true,
      data: {
        docs: transformedDocs,
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      },
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
    });
  }
};

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         surgeryDate:
 *                           type: string
 *                           format: date
 *                         recoveryDay:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *       404:
 *         description: User not found
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
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const userResponse = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      surgeryDate: user.surgeryDate,
      recoveryDay: user.calculateRecoveryDay(),
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
    });
  }
};
