-- Publication type: book, novel, story, essay, blog, article... (single-piece writings are published too).
ALTER TABLE published_books ADD COLUMN kind TEXT NOT NULL DEFAULT 'kitap';
