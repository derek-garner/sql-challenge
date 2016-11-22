DROP DATABASE IF EXISTS blog;
CREATE DATABASE blog;

\c myBlog;

CREATE TABLE blogEntries (
  ID SERIAL PRIMARY KEY,
  subject VARCHAR,
  message VARCHAR
);

INSERT INTO blogEntries (subject, message)
  VALUES ('TestSubject', 'Testmessage');