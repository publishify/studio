-- Rate limiting: fixed-window counter (recovery-code attempts, sign-in and account creation).
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  count INTEGER NOT NULL
);
