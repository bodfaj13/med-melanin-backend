import { SymptomEntry, ISymptomEntry } from '../models/symptom-entry.model';

export interface SymptomEntryRequest {
  date: string;
  painLevel: number;
  location?: string;
  description?: string;
  medications?: string;
}

export interface SymptomEntryResponse {
  success: boolean;
  data?: ISymptomEntry | ISymptomEntry[];
  message: string;
}

export class SymptomEntryService {
  static async createEntry(
    userId: string,
    entryData: SymptomEntryRequest
  ): Promise<SymptomEntryResponse> {
    try {
      const newEntry = new SymptomEntry({
        userId,
        ...entryData,
      });

      const savedEntry = await newEntry.save();
      return {
        success: true,
        data: savedEntry,
        message: 'Symptom entry created successfully',
      };
    } catch (error) {
      console.error('Error creating symptom entry:', error);
      return {
        success: false,
        message: 'Failed to create symptom entry',
      };
    }
  }

  static async getUserEntries(userId: string): Promise<SymptomEntryResponse> {
    try {
      const entries = await SymptomEntry.find({ userId })
        .sort({ timestamp: -1 })
        .exec();

      return {
        success: true,
        data: entries,
        message: 'Symptom entries retrieved successfully',
      };
    } catch (error) {
      console.error('Error retrieving symptom entries:', error);
      return {
        success: false,
        message: 'Failed to retrieve symptom entries',
      };
    }
  }

  static async updateEntry(
    userId: string,
    entryId: string,
    updateData: Partial<SymptomEntryRequest>
  ): Promise<SymptomEntryResponse> {
    try {
      const updatedEntry = await SymptomEntry.findOneAndUpdate(
        { _id: entryId, userId },
        updateData,
        { new: true }
      );

      if (!updatedEntry) {
        return {
          success: false,
          message: 'Symptom entry not found',
        };
      }

      return {
        success: true,
        data: updatedEntry,
        message: 'Symptom entry updated successfully',
      };
    } catch (error) {
      console.error('Error updating symptom entry:', error);
      return {
        success: false,
        message: 'Failed to update symptom entry',
      };
    }
  }

  static async deleteEntry(
    userId: string,
    entryId: string
  ): Promise<SymptomEntryResponse> {
    try {
      const deletedEntry = await SymptomEntry.findOneAndDelete({
        _id: entryId,
        userId,
      });

      if (!deletedEntry) {
        return {
          success: false,
          message: 'Symptom entry not found',
        };
      }

      return {
        success: true,
        message: 'Symptom entry deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting symptom entry:', error);
      return {
        success: false,
        message: 'Failed to delete symptom entry',
      };
    }
  }

  static async clearUserEntries(userId: string): Promise<SymptomEntryResponse> {
    try {
      await SymptomEntry.deleteMany({ userId });

      return {
        success: true,
        message: 'All symptom entries cleared successfully',
      };
    } catch (error) {
      console.error('Error clearing symptom entries:', error);
      return {
        success: false,
        message: 'Failed to clear symptom entries',
      };
    }
  }
}
