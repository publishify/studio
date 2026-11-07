-- Publish (CMS): books the author makes public. The draft text is not here; it stays in the book's Durable Object;
-- a publication is a copy and changes whenever the author presses "Publish/Update".
CREATE TABLE published_books (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'tr',
  published INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
CREATE INDEX published_books_user ON published_books(user_id);
CREATE TABLE published_chapters (
  book_id TEXT NOT NULL REFERENCES published_books(id) ON DELETE CASCADE,
  n INTEGER NOT NULL,
  part TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (book_id, n)
);
