import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  imageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Books table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  userId: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Book detection records
export const bookDetections = pgTable("book_detections", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  isDetected: boolean("is_detected").default(false).notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const insertBookDetectionSchema = createInsertSchema(bookDetections).pick({
  bookId: true,
  isDetected: true,
});

export type InsertBookDetection = z.infer<typeof insertBookDetectionSchema>;
export type BookDetection = typeof bookDetections.$inferSelect;

// Schedule items
export const scheduleItems = pgTable("schedule_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  requiredBookIds: json("required_book_ids").$type<number[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScheduleItemSchema = createInsertSchema(scheduleItems).pick({
  userId: true,
  title: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  requiredBookIds: true,
});

export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type ScheduleItem = typeof scheduleItems.$inferSelect;

// NeoPack status
export const neopackStatus = pgTable("neopack_status", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  batteryPercentage: integer("battery_percentage").notNull(),
  weightValue: decimal("weight_value", { precision: 4, scale: 2 }).notNull(),
  weightPercentage: integer("weight_percentage").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertNeopackStatusSchema = createInsertSchema(neopackStatus).pick({
  userId: true,
  batteryPercentage: true,
  weightValue: true,
  weightPercentage: true,
});

export type InsertNeopackStatus = z.infer<typeof insertNeopackStatusSchema>;
export type NeopackStatus = typeof neopackStatus.$inferSelect;

// Suggestions
export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // weather, schedule, battery, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSuggestionSchema = createInsertSchema(suggestions).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
});

export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestions.$inferSelect;

// Daily activity data
export const activityData = pgTable("activity_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  avgWeight: decimal("avg_weight", { precision: 4, scale: 2 }).notNull(),
  usageHours: decimal("usage_hours", { precision: 4, scale: 2 }).notNull(),
});

export const insertActivityDataSchema = createInsertSchema(activityData).pick({
  userId: true,
  date: true,
  avgWeight: true,
  usageHours: true,
});

export type InsertActivityData = z.infer<typeof insertActivityDataSchema>;
export type ActivityData = typeof activityData.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  books: many(books),
  scheduleItems: many(scheduleItems),
  neopackStatus: many(neopackStatus),
  suggestions: many(suggestions),
  activityData: many(activityData),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  user: one(users, { fields: [books.userId], references: [users.id] }),
  detections: many(bookDetections),
}));

export const bookDetectionsRelations = relations(bookDetections, ({ one }) => ({
  book: one(books, { fields: [bookDetections.bookId], references: [books.id] }),
}));

export const scheduleItemsRelations = relations(scheduleItems, ({ one }) => ({
  user: one(users, { fields: [scheduleItems.userId], references: [users.id] }),
}));

export const neopackStatusRelations = relations(neopackStatus, ({ one }) => ({
  user: one(users, { fields: [neopackStatus.userId], references: [users.id] }),
}));

export const suggestionsRelations = relations(suggestions, ({ one }) => ({
  user: one(users, { fields: [suggestions.userId], references: [users.id] }),
}));

export const activityDataRelations = relations(activityData, ({ one }) => ({
  user: one(users, { fields: [activityData.userId], references: [users.id] }),
}));
