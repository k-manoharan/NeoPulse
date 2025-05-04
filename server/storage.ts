import { db } from "@db";
import { 
  users, 
  books, 
  bookDetections, 
  scheduleItems, 
  neopackStatus, 
  suggestions,
  activityData 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export const storage = {
  // User operations
  async getUser(userId: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
  },
  
  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },
  
  async createUser(userData: any) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },
  
  // Book operations
  async getUserBooks(userId: number) {
    return await db.query.books.findMany({
      where: eq(books.userId, userId),
      orderBy: books.title
    });
  },
  
  async createBook(bookData: any) {
    const [book] = await db.insert(books).values(bookData).returning();
    return book;
  },
  
  async getBookDetectionStatus(bookId: number) {
    return await db.query.bookDetections.findFirst({
      where: eq(bookDetections.bookId, bookId),
      orderBy: desc(bookDetections.detectedAt)
    });
  },
  
  async updateBookDetection(bookId: number, isDetected: boolean) {
    const [detection] = await db.insert(bookDetections).values({
      bookId,
      isDetected,
      detectedAt: new Date()
    }).returning();
    return detection;
  },
  
  // Schedule operations
  async getUserSchedule(userId: number) {
    return await db.query.scheduleItems.findMany({
      where: eq(scheduleItems.userId, userId),
      orderBy: [scheduleItems.dayOfWeek, scheduleItems.startTime]
    });
  },
  
  async getTodaySchedule(userId: number) {
    const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
    return await db.query.scheduleItems.findMany({
      where: and(
        eq(scheduleItems.userId, userId),
        eq(scheduleItems.dayOfWeek, today)
      ),
      orderBy: scheduleItems.startTime
    });
  },
  
  async createScheduleItem(scheduleData: any) {
    const [item] = await db.insert(scheduleItems).values(scheduleData).returning();
    return item;
  },
  
  // NeoPack status operations
  async getNeopackStatus(userId: number) {
    return await db.query.neopackStatus.findFirst({
      where: eq(neopackStatus.userId, userId),
      orderBy: desc(neopackStatus.lastUpdated)
    });
  },
  
  async updateNeopackStatus(statusData: any) {
    const [status] = await db.insert(neopackStatus).values(statusData).returning();
    return status;
  },
  
  // Suggestions operations
  async getUserSuggestions(userId: number) {
    return await db.query.suggestions.findMany({
      where: eq(suggestions.userId, userId),
      orderBy: desc(suggestions.createdAt)
    });
  },
  
  async createSuggestion(suggestionData: any) {
    const [suggestion] = await db.insert(suggestions).values(suggestionData).returning();
    return suggestion;
  },
  
  // Activity data operations
  async getUserActivity(userId: number, days: number = 7) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    return await db.query.activityData.findMany({
      where: and(
        eq(activityData.userId, userId),
        // Use the SQL function to compare dates
        sql`${activityData.date} >= ${daysAgo}`
      ),
      orderBy: activityData.date
    });
  },
  
  async addActivityData(activityDataPoint: any) {
    const [dataPoint] = await db.insert(activityData).values(activityDataPoint).returning();
    return dataPoint;
  }
};
