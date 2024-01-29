import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import notesRoute from "./notes";
import tagsRoute from "./tags";
import notesToTagsRoute from "./notesToTags";

const app = new Hono();

const token = "fDxp29GNfUQ9q2wjYGKH";

app.use("/*", bearerAuth({ token }));

app.route("/notes", notesRoute);
app.route("/tags", tagsRoute);
app.route("/notesToTags", notesToTagsRoute);

export default app;
