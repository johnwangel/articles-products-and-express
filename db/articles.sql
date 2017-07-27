CREATE TABLE IF NOT EXISTS products
(
 id serial PRIMARY KEY,
 name VARCHAR(90) NOT NULL UNIQUE,
 price FLOAT(2),
 inventory INT
);

CREATE TABLE IF NOT EXISTS authors
(
 id serial PRIMARY KEY,
 name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS articles
(
 id serial PRIMARY KEY,
 title VARCHAR(255) NOT NULL UNIQUE,
 title_url VARCHAR(255) NOT NULL,
 body VARCHAR(1000),
 autor_id INT REFERENCES authors(id)
);

