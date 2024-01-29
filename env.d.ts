type Bindings = {
  DB: D1Database;
};

interface NewNote {
  slug: string;
  title: string;
  markdown: string;
}

interface Note extends NewNote {
  id: number;
  createdAt?: number;
  updatedAt?: number;
}

interface NoteSlugAndTitle {
  slug: string;
  title: string;
}

interface NewTag {
  slug: string;
  title: string;
}

interface Tag extends NewTag {
  id: number;
}
