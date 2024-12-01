-- Database structure
-- Main entities: 

-- User - has 3 types of users and specific fields chosen by user type
-- Lesson
-- Test - tied to lesson
-- Test questions and answers, tied to test

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  user_type INTEGER NOT NULL,
  org_code VARCHAR(10),
  admin_code VARCHAR(10),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE test_questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER NOT NULL REFERENCES tests(id),
  question TEXT NOT NULL,
  correct_answer TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE test_answers (
  id SERIAL PRIMARY KEY,
  test_question_id INTEGER NOT NULL REFERENCES test_questions(id),
  answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_answers (
  id,
  test_question_id,
  test_answer_id,
  correct_answer_id,
  chosen_answer_id,
  
);

