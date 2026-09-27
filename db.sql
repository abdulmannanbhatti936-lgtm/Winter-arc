CREATE DATABASE IF NOT EXISTS winter_arc;
USE winter_arc;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    log_date DATE NOT NULL,
    done TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_log (category_id, log_date)
    );

    INSERT INTO categories (name) VALUES
    ('Sleep at 11 PM'),
    ('Gym (cut phase)'),
    ('Deep Work Block'),
    ('German Practice'),
    ('No Junk Food');
    