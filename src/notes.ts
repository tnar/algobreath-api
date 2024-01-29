import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { notes, notesToTags } from "./schema";
import { eq, desc } from "drizzle-orm";

const notesRoute = new Hono<{ Bindings: Bindings }>();

notesRoute
  .get("/", async (c) => {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);

    let note = await db
      .select({ title: notes.title, slug: notes.slug })
      .from(notes)
      .orderBy(desc(notes.updatedAt));

    if (!note) {
      throw new Error(`Failed to get the latest note.`);
    }

    return c.json(note);
  })
  .post(async (c) => {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);
    const { slug, title, markdown }: NewNote = await c.req.json();
    const res = await db
      .insert(notes)
      .values({
        slug,
        title,
        markdown,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .returning({ id: notes.id });

    return c.json(res[0].id);
  })
  .put(async (c) => {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);
    const { id, slug, title, markdown }: Note = await c.req.json();
    const res = await db
      .update(notes)
      .set({ slug, title, markdown, updatedAt: Date.now() })
      .where(eq(notes.id, id));

    return c.json(res);
  });

notesRoute.get("/latest", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);

  let note = await db.select().from(notes).orderBy(desc(notes.updatedAt)).get();

  if (!note) {
    throw new Error(`Failed to get the latest note.`);
  }

  return c.json(note);
});

notesRoute.get("/:slug", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const slug = c.req.param("slug");
  if (!slug) {
    throw new Error("slug is not defined");
  }
  let note = await db.select().from(notes).where(eq(notes.slug, slug)).get();
  if (!note) {
    throw new Error(`Failed to get note with slug ${slug}.`);
  }

  return c.json(note);
});

notesRoute.delete("/:id", async (c) => {
  try {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);
    const noteId = Number(c.req.param("id"));
    if (!noteId) {
      throw new Error("id is not defined");
    }

    await db.delete(notesToTags).where(eq(notesToTags.noteId, noteId));

    const res = await db.delete(notes).where(eq(notes.id, noteId));

    return c.json(res);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default notesRoute;
