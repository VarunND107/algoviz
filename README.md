# AlgoViz

Full-stack algorithm visualizer. React + Tailwind (dark theme) frontend, Flask + PostgreSQL backend, JWT auth.

## Project structure

```
algoviz/
├── client/                        # React + Vite + Tailwind
│   ├── src/
│   │   ├── algorithms/            # Pure step-generator functions (no UI)
│   │   │   ├── sorting.js         # bubble, quick, merge, insertion, selection
│   │   │   ├── searching.js       # linear, binary
│   │   │   ├── graph.js           # BFS, DFS, Dijkstra, Floyd-Warshall
│   │   │   └── pathfinding.js     # grid Dijkstra / A*
│   │   ├── api/                   # axios client + auth/session calls
│   │   ├── components/
│   │   │   ├── controls/          # PlaybackControls, SpeedSlider, ArraySizeSlider
│   │   │   └── visualizers/       # SortingVisualizer, SearchVisualizer,
│   │   │                          # GraphVisualizer, PathfindingGrid
│   │   ├── context/                # AuthContext
│   │   ├── data/                   # static complexity table data
│   │   ├── hooks/                  # useAnimationPlayer (play/pause/speed/step)
│   │   ├── pages/                  # Home, Visualizer, Pathfinding, Complexity, Login, Register, Profile
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                        # Flask
│   ├── app/
│   │   ├── __init__.py            # app factory
│   │   ├── config.py
│   │   ├── extensions.py          # db, jwt, cors, migrate singletons
│   │   ├── models/                # user.py, session.py
│   │   ├── routes/                # auth.py, sessions.py
│   │   └── utils/
│   ├── migrations/                # flask-migrate/alembic versions
│   ├── schema.sql                 # reference DDL (source of truth for the schema)
│   ├── run.py
│   ├── requirements.txt
│   └── .env.example
│
├── docker-compose.yml              # postgres + backend + frontend
└── README.md
```

## Algorithms covered

Sorting: Bubble, Quick, Merge, Insertion, Selection
Searching: Linear, Binary
Graph: BFS, DFS, Dijkstra, Floyd-Warshall
Pathfinding: Grid-based Dijkstra / A* (click to set start/end/walls)

## Database

See [server/schema.sql](server/schema.sql) for the full DDL. Summary:

- `users` — accounts for JWT auth
- `saved_sessions` — a user's saved visualizer state (algorithm, input data, playback settings) so they can resume later

## Quick start (Windows)

Double-click [`start-algoviz.cmd`](start-algoviz.cmd) in this folder. It will:
1. Start PostgreSQL via `docker compose up -d db` (requires Docker Desktop running)
2. Open a window running the Flask backend on `http://localhost:5000`
3. Open a window running the Vite frontend on `http://localhost:5173`
4. Open your browser to `http://localhost:5173`

## Running locally

```bash
# 1. Database
docker compose up -d db

# 2. Backend
cd server
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env                                # fill in DATABASE_URL, JWT_SECRET_KEY
flask --app run db upgrade                          # or: psql < schema.sql
python run.py                                        # http://localhost:5000

# 3. Frontend
cd client
npm install
npm run dev                                          # http://localhost:5173
```
