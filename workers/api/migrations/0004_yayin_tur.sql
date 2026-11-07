-- Yayın türü: kitap, roman, hikâye, deneme, blog, makale... (tek parçalık yazılar da yayınlanır).
ALTER TABLE published_books ADD COLUMN kind TEXT NOT NULL DEFAULT 'kitap';
