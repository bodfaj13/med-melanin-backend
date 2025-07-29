import { User, IUser } from '../models/user.model';
import { PaginateResult } from 'mongoose';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  surgeryDate?: Date;
  preferences?: Record<string, unknown>;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  averageAge: number;
}

class UserService {
  /**
   * Get all users with pagination and filters
   */
  async getUsers(filters: UserFilters = {}): Promise<PaginateResult<IUser>> {
    const { page = 1, limit = 10, search, role, isActive } = filters;

    const query: Record<string, unknown> = {};

    // Add search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Add role filter
    if (role) {
      query.role = role;
    }

    // Add active status filter
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: '-password', // Exclude password from results
    };

    return await User.paginate(query, options);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select('-password');
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('-password');
  }

  /**
   * Update user
   */
  async updateUser(
    userId: string,
    updateData: UpdateUserData
  ): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
      });
      if (existingUser) {
        throw new Error('Email is already taken');
      }
    }

    // Update user fields
    Object.assign(user, updateData);
    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.deleteOne();
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = true;
    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Calculate average age (if age field exists)
    const usersWithAge = await User.find({ age: { $exists: true } });
    const averageAge =
      usersWithAge.length > 0
        ? usersWithAge.reduce(
          (sum: number, user: IUser) =>
            sum + ((user as IUser & { age?: number }).age || 0),
          0
        ) / usersWithAge.length
        : 0;

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      averageAge: Math.round(averageAge),
    };
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Record<string, unknown>
  ): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(
    userId: string
  ): Promise<Record<string, unknown> | null> {
    const user = await User.findById(userId).select('preferences');
    return user?.preferences || null;
  }
}

export const userService = new UserService();
