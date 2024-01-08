import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { notes, tags, notesToTags } from "./schema";
import { eq, desc } from "drizzle-orm";
import { bearerAuth } from "hono/bearer-auth";

const app = new Hono();

const token = "fDxp29GNfUQ9q2wjYGKH";

app.use("/*", bearerAuth({ token }));

app.get("/notes", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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
});

app.get("/notes/latest", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

app.get("/notes/:slug", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

app.post("/notes", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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
});

app.put("/notes", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

app.delete("/notes/:id", async (c) => {
  try {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env as Env;
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

app.get("/tags", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);

  let res = await db.select().from(tags);
  if (!res) {
    throw new Error(`Failed to get notes.`);
  }

  return c.json(res);
});

app.get("/tags/:slug", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const slug = c.req.param("slug");
  if (!slug) {
    throw new Error("slug is not defined");
  }
  let tag = await db.select().from(tags).where(eq(tags.slug, slug)).get();
  if (!tag) {
    throw new Error(`Failed to get tag with slug ${slug}.`);
  }

  return c.json(tag);
});

app.post("/tags", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const { slug, title }: NewTag = await c.req.json();
  const res = await db.insert(tags).values({
    slug,
    title,
  });

  return c.json(res);
});

app.put("/tags", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const { id, slug, title }: Tag = await c.req.json();
  const res = await db.update(tags).set({ slug, title }).where(eq(tags.id, id));

  return c.json(res);
});

app.delete("/tags/:id", async (c) => {
  try {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env as Env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);
    const tagId = Number(c.req.param("id"));
    if (!tagId) {
      throw new Error("id is not defined");
    }

    await db.delete(notesToTags).where(eq(notesToTags.tagId, tagId));

    const res = await db.delete(tags).where(eq(tags.id, tagId));

    return c.json(res);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post("/notesToTags", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

app.delete("/notesToTags/:noteId/:tagId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
  if (!DB) {
    throw new Error("Required environment variables are not defined");
  }
  const db = drizzle(DB);
  const noteId = c.req.param("noteId");
  if (!noteId) {
    throw new Error("id is not defined");
  }
  const tagId = c.req.param("tagId");
  if (!tagId) {
    throw new Error("id is not defined");
  }
  const res = await db
    .delete(notesToTags)
    .where(
      eq(notesToTags.noteId, Number(noteId)) &&
        eq(notesToTags.tagId, Number(tagId))
    );

  return c.json(res);
});

app.get("/notesToTags/notes/:noteId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

app.get("/notesToTags/tags/:tagId", async (c) => {
  if (!c.env) {
    throw new Error("Environment variables are not defined");
  }
  const { DB } = c.env as Env;
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

export default app;
