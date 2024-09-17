# Algobreath API

Algobreath API is a RESTful API built with TypeScript and the Hono framework, utilizing Drizzle ORM for database interactions with SQLite. It manages notes and tags with a many-to-many relationship.

## Features

- **Notes Management**: Create, read, update, and delete notes.
- **Tags Management**: Create, read, update, and delete tags.
- **Relationship Handling**: Associate tags with notes.
- **Authentication**: Secured with Bearer Token authentication.

## Technologies

- **Framework**: [Hono](https://hono.dev/)
- **ORM**: [Drizzle ORM](https://drizzle.team/)
- **Database**: SQLite via Cloudflare Workers D1
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for deploying to Cloudflare Workers

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/algobreath-api.git
   cd algobreath-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `wrangler.toml` file with your Cloudflare Workers D1 database credentials.

4. **Run Migrations**

   Generate and apply database migrations:

   ```bash
   npm run migrations:gen
   npm run migrations:apply
   ```

### Running the Development Server

Start the development server with hot-reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`.

### Deployment

Deploy the API to Cloudflare Workers:

```bash
npm run deploy
```

## API Endpoints

### Authentication

All endpoints are secured with Bearer Token authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Notes

- **GET /notes**

  Retrieve all notes.

- **POST /notes**

  Create a new note.

  ```json
  {
    "slug": "unique-slug",
    "title": "Note Title",
    "markdown": "Note content in markdown."
  }
  ```

- **PUT /notes**

  Update an existing note.

  ```json
  {
    "id": 1,
    "slug": "updated-slug",
    "title": "Updated Title",
    "markdown": "Updated content."
  }
  ```

- **GET /notes/latest**

  Retrieve the latest updated note.

- **GET /notes/:slug**

  Retrieve a note by its slug.

- **DELETE /notes/:id**

  Delete a note by its ID.

### Tags

- **GET /tags**

  Retrieve all tags.

- **POST /tags**

  Create a new tag.

  ```json
  {
    "slug": "unique-tag-slug",
    "title": "Tag Title"
  }
  ```

- **PUT /tags**

  Update an existing tag.

  ```json
  {
    "id": 1,
    "slug": "updated-tag-slug",
    "title": "Updated Tag Title"
  }
  ```

- **GET /tags/:slug**

  Retrieve a tag by its slug.

- **DELETE /tags/:id**

  Delete a tag by its ID.

### Notes to Tags

- **POST /notesToTags**

  Associate a tag with a note.

  ```json
  {
    "noteId": 1,
    "tagId": "2"
  }
  ```

- **GET /notesToTags/notes/:noteId**

  Retrieve all tag IDs associated with a note.

- **GET /notesToTags/tags/:tagId**

  Retrieve all notes associated with a tag.

- **DELETE /notesToTags/:noteId/:tagId**

  Remove the association between a note and a tag.

## Database Schema

### Tables

- **notes**
  - `id` (integer, primary key, auto-increment)
  - `slug` (text, unique, not null)
  - `title` (text, not null)
  - `markdown` (text, not null)
  - `createdAt` (integer, not null)
  - `updatedAt` (integer, not null)

- **tags**
  - `id` (integer, primary key, auto-increment)
  - `slug` (text, unique, not null)
  - `title` (text, not null)

- **notes_to_tags**
  - `note_id` (integer, not null, foreign key to `notes.id`)
  - `tag_id` (integer, not null, foreign key to `tags.id`)
  - **Primary Key**: (`note_id`, `tag_id`)

## Scripts

- **Install Dependencies**

  ```bash
  npm install
  ```

- **Run Development Server**

  ```bash
  npm run dev
  ```

- **Deploy to Cloudflare Workers**

  ```bash
  npm run deploy
  ```

- **Generate Migrations**

  ```bash
  npm run migrations:gen
  ```

- **Apply Migrations Locally**

  ```bash
  npm run local:migrations:apply
  ```

- **Apply Migrations to Production**

  ```bash
  npm run migrations:apply
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
