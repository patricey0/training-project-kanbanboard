-- On cree une transaction, c'est a dire qu'on va securiser notre code SQL : si une erreur survient, il stop le code et annule le traitement precedent. Ca permet d'Éviter de se retrouver avec du rÉsidu en cas d'erreur.
BEGIN;

-- DDL (Definition Data Language): Structure de la base (tables)

-- nous permet de reset la base en supprimant les tables existantes du mÊme nom
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";

CREATE TABLE "list" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "position" INT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL UNIQUE,
    "position" INT,
    "color" TEXT DEFAULT '#FFFFFF',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    "list_id" INT NOT NULL REFERENCES "list"("id") ON DELETE CASCADE
);

CREATE TABLE "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "color" TEXT DEFAULT '#FFFFFF',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

-- | card_id | tag_id |
-- |    1    |   1    |
-- |    1    |   2    |
-- |    2    |   1    |
CREATE TABLE "card_has_tag" (
    "card_id" INT NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
    "tag_id" INT NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    -- on créé une clef composite, c'est à dire une clef primaire qui regroupe plusieurs champs
    PRIMARY KEY("card_id", "tag_id")
);

-- SEEDING : on insère de la data fictive pour nos tests

-- DML (Data Manipulation Language) : Data

-- on insère trois listes
INSERT INTO "list"("name", "position") VALUES
('To do', 1),
('In progress', 2),
('Done', 3);

-- on insère 4 cartes
INSERT INTO "card"("title", "position", "color", "list_id") VALUES
('faire le wireframe', 1, '#f0f', 2),
('faire le MCD', 2, DEFAULT,1),
('faire le MLD', 3, DEFAULT,1),
('faire le MPD', 4, DEFAULT,1);

-- on insère 5 tags
INSERT INTO "tag" ("name", "color") VALUES
('gdp', '#1ABC9C'),
('html', '#2F4F4F'),
('css', '#fof'),
('javascript', '#F1C40F'),
('front', '#218c93'),
('back', '#4b4a4a');

-- on va associer des tags à des cartes
INSERT INTO "card_has_tag"("card_id", "tag_id") VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1);

-- Fin de la transaction
COMMIT;