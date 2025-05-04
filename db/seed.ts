import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import 'dotenv/config';

async function seed() {
  try {
    console.log("Seeding database...");

    // Create default user if not exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "alex_johnson")
    });

    let user;
    if (!existingUser) {
      console.log("Creating default user...");
      const [newUser] = await db.insert(schema.users).values({
        username: "alex_johnson",
        password: "hashed_password", // In a real app, this would be properly hashed
        name: "Alex Johnson",
        email: "alex.j@example.com",
        imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
      }).returning();
      
      user = newUser;
      console.log("Default user created.");
    } else {
      user = existingUser;
      console.log("Default user already exists.");
    }

    // Create books if they don't exist
    const bookData = [
      { title: "Advanced Physics", author: "Robert Stevens" },
      { title: "Calculus II", author: "Maria Garcia" },
      { title: "Programming 101", author: "Taro Yamada" },
      { title: "History of Science", author: "Emma Wilson" },
      { title: "Literary Analysis", author: "James Parker" },
      { title: "Organic Chemistry", author: "Sarah Johnson" },
      { title: "World Economics", author: "Michael Chen" },
    ];

    const existingBooks = await db.query.books.findMany({
      where: eq(schema.books.userId, user.id)
    });
    
    const existingBookTitles = new Set(existingBooks.map(book => book.title));
    
    for (const book of bookData) {
      if (!existingBookTitles.has(book.title)) {
        await db.insert(schema.books).values({
          ...book,
          userId: user.id
        });
      }
    }
    
    console.log("Books seeded.");

    // Retrieve all books to set detection status
    const allBooks = await db.query.books.findMany({
      where: eq(schema.books.userId, user.id)
    });
    
    // Set the first 3 books as detected in the bag
    for (const book of allBooks) {
      const isDetected = ["Advanced Physics", "Calculus II", "Programming 101"].includes(book.title);
      
      await db.insert(schema.bookDetections).values({
        bookId: book.id,
        isDetected,
        detectedAt: new Date()
      });
    }
    
    console.log("Book detection status seeded.");

    // Create schedule items for the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
    
    // Clear existing schedule items for today
    await db.delete(schema.scheduleItems)
      .where(
        eq(schema.scheduleItems.dayOfWeek, today)
      );
    
    // Get book IDs by title
    const bookMap = new Map(allBooks.map(book => [book.title, book.id]));
    
    // Create today's schedule
    const todaySchedule = [
      {
        title: "Physics Lab",
        startTime: "09:00",
        endTime: "11:00",
        requiredBookIds: [bookMap.get("Advanced Physics")]
      },
      {
        title: "Math Class",
        startTime: "13:30",
        endTime: "15:00",
        requiredBookIds: [bookMap.get("Calculus II")]
      },
      {
        title: "Literature Seminar",
        startTime: "15:30",
        endTime: "17:00",
        requiredBookIds: [bookMap.get("Literary Analysis")]
      },
      {
        title: "History Lecture",
        startTime: "17:30",
        endTime: "19:00",
        requiredBookIds: [bookMap.get("History of Science")]
      }
    ];
    
    for (const scheduleItem of todaySchedule) {
      const filteredBookIds = scheduleItem.requiredBookIds.filter(Boolean) as number[];
      await db.insert(schema.scheduleItems).values({
        userId: user.id,
        title: scheduleItem.title,
        dayOfWeek: today,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,
        requiredBookIds: filteredBookIds
      });
    }
    
    console.log("Schedule items seeded.");

    // Create neopack status
    await db.insert(schema.neopackStatus).values({
      userId: user.id,
      batteryPercentage: 85,
      weightValue: "3.1", // Converting to string as required by schema
      weightPercentage: 62,
      lastUpdated: new Date()
    });
    
    console.log("NeoPack status seeded.");

    // Create suggestions
    const suggestionData = [
      {
        type: "weather",
        title: "Weather Alert",
        description: "Rain expected today. Consider taking your waterproof NeoPack cover."
      },
      {
        type: "schedule",
        title: "Study Session",
        description: "You have a 3-hour gap between classes. Perfect time to review Calculus II."
      },
      {
        type: "battery",
        title: "Power Management",
        description: "Long day ahead. Remember to bring your portable charger."
      }
    ];
    
    // Clear existing suggestions
    await db.delete(schema.suggestions)
      .where(
        eq(schema.suggestions.userId, user.id)
      );
    
    for (const suggestion of suggestionData) {
      await db.insert(schema.suggestions).values({
        userId: user.id,
        ...suggestion
      });
    }
    
    console.log("Suggestions seeded.");

    // Create activity data for the last 7 days
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      activityData.push({
        userId: user.id,
        date: date,
        avgWeight: (2.5 + Math.random() * 2).toFixed(1), // Random weight between 2.5 and 4.5 kg
        usageHours: (4 + Math.random() * 6).toFixed(1) // Random usage between 4 and 10 hours
      } as schema.InsertActivityData);
    }
    
    // Clear existing activity data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    for (const activity of activityData) {
      await db.insert(schema.activityData).values(activity);
    }
    
    console.log("Activity data seeded.");
    
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
