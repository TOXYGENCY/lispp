-- cmd.exe
-- psql -h localhost -p 5432 -U postgres
-- \i db-create.sql
-- \q

CREATE DATABASE lispp
WITH ENCODING 'UTF8'
LC_COLLATE='ru_RU.UTF-8'
LC_CTYPE='ru_RU.UTF-8'
TEMPLATE=template0;

\connect lispp

-- Коды администраторов
CREATE TABLE admin_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL
);

-- Организации (для проверки кодов)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR NOT NULL
);

-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  user_type INTEGER NOT NULL,
  organization_id INTEGER REFERENCES organizations(id),
  admin_code_id INTEGER REFERENCES admin_codes(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Главы блоков
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Блоки тем
CREATE TABLE blocks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь блоков и глав 
CREATE TABLE chapter_blocks (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  block_id INTEGER NOT NULL REFERENCES blocks(id)
);

-- Параграфы в блоках
CREATE TABLE paragraphs (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR,
  block_id INTEGER NOT NULL REFERENCES blocks(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь параграфов и блоков
CREATE TABLE paragraph_blocks (
  id SERIAL PRIMARY KEY,
  paragraph_id INTEGER NOT NULL REFERENCES paragraphs(id),
  block_id INTEGER NOT NULL REFERENCES blocks(id)
);

-- Тесты
CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  block_id INTEGER NOT NULL REFERENCES blocks(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь тестов и глав
CREATE TABLE test_blocks (
  id SERIAL PRIMARY KEY,
  test_id INTEGER NOT NULL REFERENCES tests(id),
  block_id INTEGER NOT NULL REFERENCES blocks(id)
);

-- Связь вопросов и тестов
CREATE TABLE test_questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER NOT NULL REFERENCES tests(id),
  question VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Варианты ответов к вопросам и связь каждого вопроса с тестом
CREATE TABLE test_answers (
  id SERIAL PRIMARY KEY,
  test_question_id INTEGER NOT NULL REFERENCES test_questions(id),
  answer VARCHAR NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Ответы пользователя
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  test_question_id INTEGER NOT NULL REFERENCES test_questions(id),
  chosen_answer_id INTEGER NOT NULL REFERENCES test_answers(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);