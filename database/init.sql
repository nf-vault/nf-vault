CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(60) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS Documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  preview_path TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  parent_id INTEGER REFERENCES Documents(id)
);

CREATE TABLE IF NOT EXISTS Invite_Codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  usages_left INTEGER NOT NULL,
  generated_by INTEGER REFERENCES Users(id)
);

INSERT INTO Invite_Codes (code, usages_left, generated_by)
VALUES ('AAAA', 1, NULL);