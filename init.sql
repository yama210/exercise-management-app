-- records テーブル
CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_calories INT NOT NULL
);

-- exercises テーブル
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    record_id INT REFERENCES records(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    minutes INT NOT NULL,
    calories INT NOT NULL
);
