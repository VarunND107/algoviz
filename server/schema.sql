-- AlgoViz PostgreSQL schema
-- Source of truth for the data model. Flask-Migrate/Alembic migrations
-- (server/migrations) are generated from the SQLAlchemy models in
-- server/app/models, which mirror this file.

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- ─────────────────────────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- ─────────────────────────────────────────────────────────────────
-- saved_sessions
-- A user's saved visualizer state so a run can be resumed/replayed later.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    algorithm       VARCHAR(50) NOT NULL CHECK (algorithm IN (
                        'bubble_sort', 'quick_sort', 'merge_sort',
                        'insertion_sort', 'selection_sort',
                        'linear_search', 'binary_search',
                        'bfs', 'dfs', 'dijkstra', 'floyd_warshall',
                        'pathfinding_grid'
                    )),
    title           VARCHAR(120),
    input_data      JSONB NOT NULL DEFAULT '{}'::jsonb,   -- array, graph, or grid snapshot
    settings        JSONB NOT NULL DEFAULT '{}'::jsonb,   -- speed, array size, algorithm variant, etc.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_sessions_user_id   ON saved_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_sessions_algorithm ON saved_sessions (algorithm);

-- ─────────────────────────────────────────────────────────────────
-- keep updated_at fresh
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_saved_sessions_updated_at ON saved_sessions;
CREATE TRIGGER trg_saved_sessions_updated_at
    BEFORE UPDATE ON saved_sessions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
