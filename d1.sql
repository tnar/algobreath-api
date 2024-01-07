BEGIN TRANSACTION;

-- Step 1: Rename the existing table
ALTER TABLE `notes` RENAME TO `notes_old`;

-- Step 2: Create a new table without the primary key constraint on the `slug` column
CREATE TABLE `notes` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` TEXT NOT NULL,
  `title` TEXT NOT NULL,
  `markdown` TEXT NOT NULL,
  `created_at` INTEGER NOT NULL,
  `updated_at` INTEGER NOT NULL
);

-- Step 3: Copy all data from the old table to the new one
INSERT INTO `notes` (`id`, `slug`, `title`, `markdown`, `created_at`, `updated_at`)
SELECT  `id`, `slug`, `title`, `markdown`, `created_at`, `updated_at`
FROM `notes_old`;

-- Step 4: Delete the old table
-- DROP TABLE `notes_old`;

COMMIT;