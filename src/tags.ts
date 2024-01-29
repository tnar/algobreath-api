import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { tags, notesToTags } from "./schema";
import { eq } from "drizzle-orm";

const tagRoute = new Hono<{ Bindings: Bindings }>();

tagRoute
  .get("/", async (c) => {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
    if (!DB) {
      throw new Error("Required environment variables are not defined");
    }
    const db = drizzle(DB);

    let res = await db.select().from(tags);
    if (!res) {
      throw new Error(`Failed to get notes.`);
    }

    return c.json(res);
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
    const { slug, title }: NewTag = await c.req.json();
    const res = await db.insert(tags).values({
      slug,
      title,
    });

    return c.json(res);
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
    const { id, slug, title }: Tag = await c.req.json();
    const res = await db
      .update(tags)
      .set({ slug, title })
      .where(eq(tags.id, id));

    return c.json(res);
  });

tagRoute.get("/:slug", async (c) => {
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
  let tag = await db.select().from(tags).where(eq(tags.slug, slug)).get();
  if (!tag) {
    throw new Error(`Failed to get tag with slug ${slug}.`);
  }

  return c.json(tag);
});

tagRoute.delete("/:id", async (c) => {
  try {
    if (!c.env) {
      throw new Error("Environment variables are not defined");
    }
    const { DB } = c.env;
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

export default tagRoute;
