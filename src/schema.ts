/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/
import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  markdown: text("markdown").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const notesRelations = relations(notes, ({ many }) => ({
  notesToTags: many(notesToTags),
}));

export const tags = sqliteTable("tags", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  notesToTags: many(notesToTags),
}));

export const notesToTags = sqliteTable(
  "notes_to_tags",
  {
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.tagId] }),
  })
);

export const notesToTagsRelations = relations(notesToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [notesToTags.tagId],
    references: [tags.id],
  }),
  note: one(notes, {
    fields: [notesToTags.noteId],
    references: [notes.id],
  }),
}));
