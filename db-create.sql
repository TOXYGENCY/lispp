-- cmd.exe
-- psql -h localhost -p 5432 -U postgres
-- \! chcp 1251
-- в пути использовать /
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
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  code VARCHAR(4) UNIQUE NOT NULL
);

-- Организации (для проверки кодов)
CREATE TABLE organizations (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR NOT NULL
);

-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  user_type INTEGER NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  -- admin_code_id UUID REFERENCES admin_codes(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Главы блоков
CREATE TABLE chapters (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Блоки тем
CREATE TABLE blocks (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь блоков и глав 
CREATE TABLE chapter_blocks (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id),
  block_id UUID NOT NULL REFERENCES blocks(id)
);

-- Параграфы в блоках
CREATE TABLE paragraphs (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description VARCHAR,
  block_id UUID NOT NULL REFERENCES blocks(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь параграфов и блоков
CREATE TABLE paragraph_blocks (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  paragraph_id UUID NOT NULL REFERENCES paragraphs(id),
  block_id UUID NOT NULL REFERENCES blocks(id)
);

-- Тесты
CREATE TABLE tests (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  block_id UUID NOT NULL REFERENCES blocks(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Связь тестов и глав
CREATE TABLE test_blocks (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id),
  block_id UUID NOT NULL REFERENCES blocks(id)
);

-- Связь вопросов и тестов
CREATE TABLE test_questions (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id),
  question VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Варианты ответов к вопросам и связь каждого вопроса с тестом
CREATE TABLE test_answers (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  test_question_id UUID NOT NULL REFERENCES test_questions(id),
  answer VARCHAR NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Ответы пользователя
CREATE TABLE user_answers (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  test_question_id UUID NOT NULL REFERENCES test_questions(id),
  chosen_answer_id UUID NOT NULL REFERENCES test_answers(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO organizations (code, name) VALUES ('001', 'MGPPU');
INSERT INTO admin_codes (code) VALUES ('0001');
