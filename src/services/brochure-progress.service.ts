import {
  BrochureProgress,
  IBrochureProgress,
} from '../models/brochure-progress.model';

export interface ProgressUpdateRequest {
  sectionId: string;
  itemId: string;
  completed: boolean;
  notes?: string;
}

export interface ProgressResponse {
  success: boolean;
  data?: IBrochureProgress | IBrochureProgress[];
  message: string;
}

export class BrochureProgressService {
  /**
   * Update or create a progress item for a user
   */
  static async updateProgress(
    userId: string,
    sectionId: string,
    itemId: string,
    completed: boolean,
    notes?: string
  ): Promise<ProgressResponse> {
    try {
      const progress = await BrochureProgress.findOneAndUpdate(
        { userId, sectionId, itemId },
        { completed, notes, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      return {
        success: true,
        data: progress as IBrochureProgress,
        message: 'Progress updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update progress',
      };
    }
  }

  /**
   * Get all progress for a user
   */
  static async getUserProgress(userId: string): Promise<ProgressResponse> {
    try {
      const progress = await BrochureProgress.find({ userId });

      return {
        success: true,
        data: progress as IBrochureProgress[],
        message: 'Progress retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve progress',
      };
    }
  }

  /**
   * Get progress for a specific section
   */
  static async getSectionProgress(
    userId: string,
    sectionId: string
  ): Promise<ProgressResponse> {
    try {
      const progress = await BrochureProgress.find({ userId, sectionId });

      return {
        success: true,
        data: progress as IBrochureProgress[],
        message: 'Section progress retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve section progress',
      };
    }
  }

  /**
   * Delete progress for a user (reset all progress)
   */
  static async resetProgress(userId: string): Promise<ProgressResponse> {
    try {
      await BrochureProgress.deleteMany({ userId });

      return {
        success: true,
        message: 'Progress reset successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to reset progress',
      };
    }
  }
}
