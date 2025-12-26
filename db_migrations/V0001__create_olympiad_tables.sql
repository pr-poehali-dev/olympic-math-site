-- Таблица участников олимпиады
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'pending',
    access_granted BOOLEAN DEFAULT FALSE
);

-- Таблица заданий олимпиады
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    difficulty_level VARCHAR(50) DEFAULT 'medium',
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица результатов участников
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER NOT NULL REFERENCES participants(id),
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    user_answer VARCHAR(255),
    is_correct BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP,
    time_spent_seconds INTEGER,
    UNIQUE(participant_id, task_id)
);

-- Таблица платежей
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER NOT NULL REFERENCES participants(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения запросов
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_payment_status ON participants(payment_status);
CREATE INDEX idx_results_participant ON results(participant_id);
CREATE INDEX idx_results_task ON results(task_id);
CREATE INDEX idx_payments_participant ON payments(participant_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Вставка тестовых заданий
INSERT INTO tasks (question, correct_answer, points, difficulty_level, order_number) VALUES
('У Маши было 15 конфет. Она съела 7 конфет. Сколько конфет осталось?', '8', 5, 'easy', 1),
('В классе 12 мальчиков и 14 девочек. Сколько всего детей в классе?', '26', 5, 'easy', 2),
('Сколько будет 9 × 8?', '72', 10, 'medium', 3),
('На полке стояло 24 книги. После того, как несколько книг взяли, осталось 18. Сколько книг взяли?', '6', 10, 'medium', 4),
('Периметр квадрата 20 см. Чему равна длина одной стороны?', '5', 15, 'hard', 5);
