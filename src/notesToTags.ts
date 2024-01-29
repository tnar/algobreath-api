import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { notes, tags, notesToTags } from "./schema";
import { eq, desc, and } from "drizzle-orm";

const notesToTagsRoute = new Hono<{ Bindings: Bindings }>();

notesToTagsRoute.post("/", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const { noteId, tagId }: { noteId: number; tagId: string } =
    await c.req.json();
  const res = await db.insert(notesToTags).values({
    noteId,
    tagId: Number(tagId),
  });

  return c.json(res);
});

notesToTagsRoute.get("/notes/:noteId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const noteId = c.req.param("noteId");
  if (!noteId) {
    throw new Error("noteId is not defined");
  }

  const res = await db
    .select()
    .from(notesToTags)
    // .leftJoin(tags, eq(notesToTags.tagId, tags.id))
    .leftJoin(notes, eq(notesToTags.noteId, notes.id))
    .where(eq(notes.id, Number(noteId)));

  if (!res) {
    throw new Error(`Failed to get tags.`);
  }

  const tagIds = res.map((noteToTag) => noteToTag.notes_to_tags.tagId);
  return c.json(tagIds);
});

notesToTagsRoute.get("/tags/:tagId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const tagId = Number(c.req.param("tagId"));
  if (!tagId) {
    throw new Error("tagId is not defined");
  }

  const res = await db
    .select({ title: notes.title, slug: notes.slug })
    .from(notesToTags)
    .leftJoin(notes, eq(notesToTags.noteId, notes.id))
    .leftJoin(tags, eq(notesToTags.tagId, tags.id))
    .where(eq(tags.id, tagId))
    .orderBy(desc(notes.updatedAt));

  if (!res) {
    throw new Error(`Failed to get notes.`);
  }

  return c.json(res);
});

notesToTagsRoute.delete("/:noteId/:tagId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const noteId = c.req.param("noteId");
  if (!noteId) {
    throw new Error("noteId is not defined");
  }
  const tagId = c.req.param("tagId");
  if (!tagId) {
    throw new Error("tagId is not defined");
  }
  const res = await db
    .delete(notesToTags)
    .where(
      and(
        eq(notesToTags.noteId, Number(noteId)),
        eq(notesToTags.tagId, Number(tagId))
      )
    );

  return c.json(res);
});

export default notesToTagsRoute;
