DROP DATABASE IF EXISTS myBlog;
CREATE DATABASE myBlog;

\c myBlog;

CREATE TABLE myBlogEntry (
  ID SERIAL PRIMARY KEY,
  subject VARCHAR,
  msg VARCHAR
);

INSERT INTO blogEntry (subject, msg)
  VALUES ('TestSubject', 'TestMsg');