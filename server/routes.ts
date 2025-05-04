import type { Express } from "express";
import { createServer, type Server } from "http";
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
import { eq, and, desc, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Get user (for demo purposes, always return first user)
  app.get(`${apiPrefix}/user`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        columns: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        }
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get NeoPack status
  app.get(`${apiPrefix}/neopack/status`, async (req, res) => {
    try {
      // For demo, get the first user's neopack status
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const statusData = await db.query.neopackStatus.findFirst({
        where: eq(neopackStatus.userId, user.id),
        orderBy: desc(neopackStatus.lastUpdated)
      });
      
      if (!statusData) {
        return res.status(404).json({ message: "NeoPack status not found" });
      }
      
      return res.json({
        battery: {
          percentage: statusData.batteryPercentage,
          lastUpdated: statusData.lastUpdated
        },
        weight: {
          value: parseFloat(statusData.weightValue.toString()),
          percentage: statusData.weightPercentage,
          lastUpdated: statusData.lastUpdated
        }
      });
    } catch (error) {
      console.error("Error fetching neopack status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update NeoPack status
  app.post(`${apiPrefix}/neopack/status`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { batteryPercentage, weightValue, weightPercentage } = req.body;
      
      const [newStatus] = await db.insert(neopackStatus).values({
        userId: user.id,
        batteryPercentage,
        weightValue,
        weightPercentage,
        lastUpdated: new Date()
      }).returning();
      
      return res.status(201).json(newStatus);
    } catch (error) {
      console.error("Error updating neopack status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get books (detected and missing)
  app.get(`${apiPrefix}/neopack/books`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get all books for the user with their detection status
      const userBooks = await db.select({
        id: books.id,
        title: books.title,
        author: books.author,
        isDetected: bookDetections.isDetected,
        detectedAt: bookDetections.detectedAt
      })
      .from(books)
      .leftJoin(
        bookDetections,
        and(
          eq(books.id, bookDetections.bookId),
          eq(bookDetections.isDetected, true)
        )
      )
      .where(eq(books.userId, user.id));
      
      // Get today's schedule
      const currentDay = new Date().getDay(); // 0-6 (Sunday-Saturday)
      const todaySchedule = await db.query.scheduleItems.findMany({
        where: eq(scheduleItems.dayOfWeek, currentDay),
        orderBy: scheduleItems.startTime
      });
      
      // Get required book IDs for today's schedule
      const requiredBookIds = new Set<number>();
      todaySchedule.forEach(item => {
        const bookIds = item.requiredBookIds as number[];
        bookIds.forEach(id => requiredBookIds.add(id));
      });
      
      // Separate books into detected and missing
      const detectedBooks = [];
      const missingBooks = [];
      
      for (const book of userBooks) {
        if (book.isDetected) {
          detectedBooks.push({
            id: book.id,
            title: book.title,
            author: book.author
          });
        } else if (requiredBookIds.has(book.id)) {
          // Find the schedule item that requires this book
          const relevantSchedule = todaySchedule.find(item => 
            (item.requiredBookIds as number[]).includes(book.id)
          );
          
          missingBooks.push({
            id: book.id,
            title: book.title,
            detail: relevantSchedule 
              ? `Needed for ${relevantSchedule.title} at ${relevantSchedule.startTime}`
              : "Needed today"
          });
        }
      }
      
      return res.json({
        detected: detectedBooks,
        missing: missingBooks
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update book detection status
  app.post(`${apiPrefix}/neopack/books/:bookId/detect`, async (req, res) => {
    try {
      const { bookId } = req.params;
      const { isDetected } = req.body;
      
      // Check if book exists
      const book = await db.query.books.findFirst({
        where: eq(books.id, parseInt(bookId))
      });
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Add new detection record
      const [detection] = await db.insert(bookDetections).values({
        bookId: parseInt(bookId),
        isDetected: !!isDetected,
        detectedAt: new Date()
      }).returning();
      
      return res.status(201).json(detection);
    } catch (error) {
      console.error("Error updating book detection:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get suggestions
  app.get(`${apiPrefix}/neopack/suggestions`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userSuggestions = await db.query.suggestions.findMany({
        where: eq(suggestions.userId, user.id),
        orderBy: desc(suggestions.createdAt)
      });
      
      return res.json(userSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new suggestion
  app.post(`${apiPrefix}/neopack/suggestions`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { type, title, description } = req.body;
      
      const [suggestion] = await db.insert(suggestions).values({
        userId: user.id,
        type,
        title,
        description
      }).returning();
      
      return res.status(201).json(suggestion);
    } catch (error) {
      console.error("Error creating suggestion:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get activity data
  app.get(`${apiPrefix}/neopack/activity`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get last 7 days of activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activities = await db.query.activityData.findMany({
        where: and(
          eq(activityData.userId, user.id),
          sql`${activityData.date} >= ${sevenDaysAgo.toISOString()}`
        ),
        orderBy: activityData.date
      });
      
      // Format data for the frontend chart
      const formattedData = activities.map(activity => {
        const date = new Date(activity.date);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          day,
          date: date.toISOString(),
          weight: parseFloat(activity.avgWeight.toString()),
          usage: parseFloat(activity.usageHours.toString())
        };
      });
      
      return res.json(formattedData);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add activity data point
  app.post(`${apiPrefix}/neopack/activity`, async (req, res) => {
    try {
      const user = await db.query.users.findFirst();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { date, avgWeight, usageHours } = req.body;
      
      const [activity] = await db.insert(activityData).values({
        userId: user.id,
        date: new Date(date),
        avgWeight,
        usageHours
      }).returning();
      
      return res.status(201).json(activity);
    } catch (error) {
      console.error("Error adding activity data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
