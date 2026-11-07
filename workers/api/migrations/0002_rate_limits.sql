-- Hız sınırlama: sabit pencereli sayaç (kurtarma kodu denemeleri, giriş ve hesap oluşturma).
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  count INTEGER NOT NULL
);
