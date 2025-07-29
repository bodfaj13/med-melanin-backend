import jwt from 'jsonwebtoken';
import { IUser, User } from '../models/user.model';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'fallback-secret';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user (password will be hashed by the model's pre-save hook)
    const user = new User({
      email,
      password, // Plain password - will be hashed by the model
      firstName,
      lastName,
    });

    await user.save();

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password using the model's comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: IUser): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const token = this.generateToken(user);
    return { token };
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password using the model's comparePassword method
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password (will be hashed by the model's pre-save hook)
    user.password = newPassword;
    await user.save();
  }

  /**
   * Reset password (for forgot password flow)
   */
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Update password (will be hashed by the model's pre-save hook)
    user.password = newPassword;
    await user.save();
  }
}

export const authService = new AuthService();
