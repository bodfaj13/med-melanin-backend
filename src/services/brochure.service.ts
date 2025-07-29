import { brochureContent } from '../data/brochure.data';

export interface BrochureItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface ContentBlock {
  id: string;
  title: string;
  items: BrochureItem[];
}

export interface BrochureSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface BrochureData {
  id: string;
  title: string;
  sections: BrochureSection[];
}

export interface BrochureProgress {
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
  lastUpdated: string;
}

class BrochureService {
  /**
   * Get brochure data
   */
  async getBrochureData(): Promise<BrochureData> {
    // For now, return the static content
    // In a real app, this would come from a database
    return {
      id: '1',
      title: 'Abdominal Myomectomy Recovery Guide',
      sections: brochureContent,
    };
  }

  /**
   * Get brochure progress for a user
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBrochureProgress(userId: string): Promise<BrochureProgress> {
    // In a real app, this would be stored in a database
    // For now, return a mock progress
    const data = await this.getBrochureData();
    const allItems = this.getAllItems(data);

    return {
      totalItems: allItems.length,
      completedItems: allItems.filter(item => item.completed).length,
      progressPercentage: 0, // This would be calculated based on user progress
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Update item status
   */
  async updateItemStatus(
    userId: string,
    itemId: string,
    completed: boolean
  ): Promise<void> {
    // In a real app, this would update the database
    // For now, just return success
    console.log(`User ${userId} updated item ${itemId} to ${completed}`);
  }

  /**
   * Update section progress
   */
  async updateSectionProgress(
    userId: string,
    sectionId: string,
    progress: number
  ): Promise<void> {
    // In a real app, this would update the database
    console.log(
      `User ${userId} updated section ${sectionId} progress to ${progress}%`
    );
  }

  /**
   * Reset progress for a user
   */
  async resetProgress(userId: string): Promise<void> {
    // In a real app, this would reset all progress in the database
    console.log(`User ${userId} reset their progress`);
  }

  /**
   * Get all items from brochure data
   */
  private getAllItems(data: BrochureData): BrochureItem[] {
    return data.sections.flatMap(section =>
      section.content.flatMap(content => content.items || [])
    );
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(items: BrochureItem[]): number {
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return (completedItems / items.length) * 100;
  }

  /**
   * Get items by section
   */
  getItemsBySection(data: BrochureData, sectionId: string): BrochureItem[] {
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return [];

    const items: BrochureItem[] = [];
    section.content.forEach(block => {
      items.push(...block.items);
    });
    return items;
  }

  /**
   * Get completed items
   */
  getCompletedItems(data: BrochureData): BrochureItem[] {
    const allItems = this.getAllItems(data);
    return allItems.filter(item => item.completed);
  }

  /**
   * Get pending items
   */
  getPendingItems(data: BrochureData): BrochureItem[] {
    const allItems = this.getAllItems(data);
    return allItems.filter(item => !item.completed);
  }
}

export const brochureService = new BrochureService();
