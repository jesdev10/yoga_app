-- =========================================================
-- BLISS MIND DATABASE
-- PostgreSQL
-- Database: yoga_db
-- =========================================================

-- =========================================================
-- DROP OLD TABLES (ensures clean rebuild without column conflicts)
-- =========================================================
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS wellness_articles CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS session_media CASCADE;
DROP TABLE IF EXISTS instructor_posts CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS session_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'instructor', 'admin', 'staff')),
    profile_image TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. SESSION TYPES
-- =========================================================

CREATE TABLE IF NOT EXISTS session_types (
    session_type_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. SESSIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS sessions (
    session_id BIGSERIAL PRIMARY KEY,
    instructor_id BIGINT NOT NULL,
    session_type_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    location VARCHAR(200),
    price NUMERIC(10,2) NOT NULL DEFAULT 0
        CHECK (price >= 0),
    image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_instructor
        FOREIGN KEY (instructor_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_session_type
        FOREIGN KEY (session_type_id)
        REFERENCES session_types(session_type_id)
        ON DELETE RESTRICT,
    CONSTRAINT valid_session_time
        CHECK (end_time > start_time)
);


-- =========================================================
-- 4. BOOKINGS
-- =========================================================

CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_session
        FOREIGN KEY (session_id)
        REFERENCES sessions(session_id)
        ON DELETE CASCADE,
    -- Prevent the same user from booking the same session twice
    CONSTRAINT unique_user_session
        UNIQUE (user_id, session_id)
);


-- =========================================================
-- 5. REVIEWS
-- =========================================================

CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    rating INTEGER NOT NULL
        CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_review_session
        FOREIGN KEY (session_id)
        REFERENCES sessions(session_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_session_review
        UNIQUE (user_id, session_id)
);


-- =========================================================
-- 6. ARTICLES
-- =========================================================

CREATE TABLE IF NOT EXISTS articles (
    article_id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_author
        FOREIGN KEY (author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. NOTIFICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. MESSAGES
-- =========================================================

CREATE TABLE IF NOT EXISTS messages (
    message_id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT different_users
        CHECK (sender_id <> receiver_id)
);


-- =========================================================
-- 9. INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_sessions_instructor
    ON sessions(instructor_id);

CREATE INDEX IF NOT EXISTS idx_sessions_type
    ON sessions(session_type_id);

CREATE INDEX IF NOT EXISTS idx_sessions_date
    ON sessions(session_date);

CREATE INDEX IF NOT EXISTS idx_bookings_user
    ON bookings(user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_session
    ON bookings(session_id);

CREATE INDEX IF NOT EXISTS idx_reviews_session
    ON reviews(session_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender
    ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_receiver
    ON messages(receiver_id);


-- =========================================================
-- 10. SAMPLE SESSION TYPES
-- =========================================================

INSERT INTO session_types (name, description)
VALUES
(
    'Yoga',
    'Traditional yoga sessions for flexibility, strength and balance.'
),
(
    'Meditation',
    'Guided meditation sessions for relaxation and mindfulness.'
),
(
    'Pilates',
    'Low-impact exercises designed to improve strength and flexibility.'
),
(
    'Mindfulness',
    'Mindfulness practices for mental relaxation and wellbeing.'
),
(
    'Wellness',
    'General wellness and healthy lifestyle sessions.'
)
ON CONFLICT (name) DO NOTHING;
