import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { validationService } from '../services/validation.service';

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Email already in use"
 *               field:
 *                 type: string
 *                 example: "email"
 *           example:
 *             - message: "Email already in use"
 *               field: "email"
 *             - message: "Password is too weak"
 *               field: "password"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         surgeryDate:
 *           type: string
 *           format: date
 *         recoveryDay:
 *           type: number
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with first name, last name, email, and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Sarah"
 *               lastName:
 *                 type: string
 *                 example: "Johnson"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "sarah.johnson@email.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               surgeryDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
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
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, surgeryDate } = req.body;

    // Validate input using validation service
    const validation = validationService.validateRegistration({
      firstName,
      lastName,
      email,
      password,
    });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors?.map(error => ({
          message: error,
          field: getFieldFromError(error),
        })),
      });
      return;
    }

    // Register user using auth service
    const authResponse = await authService.register({
      firstName: validation.sanitizedData!.firstName!,
      lastName: validation.sanitizedData!.lastName!,
      email: validation.sanitizedData!.email,
      password: validation.sanitizedData!.password,
    });

    // Update surgery date if provided (would be handled by user service)
    if (surgeryDate) {
      console.log('Surgery date would be updated:', surgeryDate);
    }

    // Send welcome email
    // Don't fail the registration if email fails
    // try {
    //   await emailService.sendWelcomeEmail(
    //     authResponse.user.email,
    //     `${authResponse.user.firstName} ${authResponse.user.lastName}`
    //   );
    // } catch (emailError) {
    //   console.error('Failed to send welcome email:', emailError);
    // }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: authResponse.user.id,
          firstName: authResponse.user.firstName,
          lastName: authResponse.user.lastName,
          email: authResponse.user.email,
          surgeryDate: surgeryDate || null,
          recoveryDay: 0, // Would be calculated based on surgery date
        },
        token: authResponse.token,
      },
      message: 'User created successfully',
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);

    if (error instanceof Error && error.message?.includes('already exists')) {
      res.status(409).json({
        success: false,
        error: 'Registration failed',
        errors: [
          {
            message: 'Email already in use',
            field: 'email',
          },
        ],
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};

// Helper function to map error messages to field names
const getFieldFromError = (error: string): string => {
  if (error.includes('First name')) return 'firstName';
  if (error.includes('Last name')) return 'lastName';
  if (error.includes('Email')) return 'email';
  if (error.includes('Password')) return 'password';
  return 'general';
};

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign in user
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "sarah.johnson@email.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User signed in successfully
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
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "User signed in successfully"
 *       400:
 *         description: Invalid credentials or validation error
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
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input using validation service
    const validation = validationService.validateLogin({ email, password });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors?.map(error => ({
          message: error,
          field: getFieldFromError(error),
        })),
      });
      return;
    }

    // Login using auth service
    const authResponse = await authService.login({
      email: validation.sanitizedData!.email,
      password: validation.sanitizedData!.password,
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: authResponse.user.id,
          firstName: authResponse.user.firstName,
          lastName: authResponse.user.lastName,
          email: authResponse.user.email,
          surgeryDate: null, // Would be fetched from user service
          recoveryDay: 0, // Would be calculated based on surgery date
        },
        token: authResponse.token,
      },
      message: 'User signed in successfully',
    });
  } catch (error) {
    console.error('Signin error:', error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: 'Authentication failed',
        errors: [
          {
            message: 'Invalid email or password',
            field: 'credentials',
          },
        ],
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to sign in',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the current user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                       $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        errors: [
          {
            message: 'Authentication token is required',
            field: 'token',
          },
        ],
      });
      return;
    }

    // Get user profile using user service
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        errors: [
          {
            message: 'User account not found',
            field: 'user',
          },
        ],
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
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
      },
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};

/**
 * @swagger
 * /api/v1/auth/surgery-date:
 *   patch:
 *     summary: Update user surgery date
 *     description: Update the current user's surgery date for recovery calculations
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - surgeryDate
 *             properties:
 *               surgeryDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Surgery date updated successfully
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
 *                   example: "Surgery date updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid surgery date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
export const updateSurgeryDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { surgeryDate } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        errors: [
          {
            message: 'Authentication token is required',
            field: 'token',
          },
        ],
      });
      return;
    }

    // Validate surgery date
    if (!surgeryDate) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'Surgery date is required',
            field: 'surgeryDate',
          },
        ],
      });
      return;
    }

    // Validate date format
    const date = new Date(surgeryDate);
    if (isNaN(date.getTime())) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'Invalid date format',
            field: 'surgeryDate',
          },
        ],
      });
      return;
    }

    // Check if date is in the future
    const today = new Date();
    if (date > today) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'Surgery date cannot be in the future',
            field: 'surgeryDate',
          },
        ],
      });
      return;
    }

    // Update user's surgery date
    const user = await userService.updateUser(userId, { surgeryDate: date });
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        errors: [
          {
            message: 'User account not found',
            field: 'user',
          },
        ],
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
    };

    res.status(200).json({
      success: true,
      message: 'Surgery date updated successfully',
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Update surgery date error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update surgery date',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};

/**
 * @swagger
 * /api/v1/auth/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update the current user's profile information (first name, last name)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        errors: [
          {
            message: 'Authentication token is required',
            field: 'token',
          },
        ],
      });
      return;
    }

    // Validate required fields
    if (!firstName || !lastName) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'First name and last name are required',
            field: 'firstName',
          },
        ],
      });
      return;
    }

    // Validate field lengths
    if (firstName.length < 2 || firstName.length > 30) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'First name must be between 2 and 30 characters',
            field: 'firstName',
          },
        ],
      });
      return;
    }

    if (lastName.length < 2 || lastName.length > 30) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'Last name must be between 2 and 30 characters',
            field: 'lastName',
          },
        ],
      });
      return;
    }

    // Update user's profile
    const user = await userService.updateUser(userId, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        errors: [
          {
            message: 'User account not found',
            field: 'user',
          },
        ],
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
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Change the current user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *       400:
 *         description: Validation failed or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        errors: [
          {
            message: 'Authentication token is required',
            field: 'token',
          },
        ],
      });
      return;
    }

    // Validate required fields
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'Current password and new password are required',
            field: 'password',
          },
        ],
      });
      return;
    }

    // Validate new password length
    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'New password must be at least 8 characters long',
            field: 'newPassword',
          },
        ],
      });
      return;
    }

    // Validate that new password is different from current
    if (currentPassword === newPassword) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: [
          {
            message: 'New password must be different from current password',
            field: 'newPassword',
          },
        ],
      });
      return;
    }

    // Change password using auth service
    await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: 'Password change failed',
        errors: [
          {
            message: error.message,
            field: 'password',
          },
        ],
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      errors: [
        {
          message: 'An unexpected error occurred. Please try again.',
          field: 'general',
        },
      ],
    });
  }
};
