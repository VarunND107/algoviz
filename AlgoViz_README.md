# AlgoViz — Interactive Algorithm Visualizer

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=flat&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google)

> A full-stack interactive algorithm visualization platform. Watch 11 algorithms run step-by-step on your own data — with an AI-powered solver built in.

---

## Live Demo

🔗 [algoviz.netlify.app](https://algoviz-varun.netlify.app/)

---

## Features

### Algorithm Visualizers
- **Sorting** — Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort
- **Searching** — Linear Search, Binary Search
- **Graph** — BFS, DFS, Dijkstra's Algorithm, Floyd-Warshall

### Core Functionality
- ⚡ Step-by-step animations with play, pause, and speed controls
- 🎯 User-controlled input — type your own array or build your own graph
- 🗺️ Grid-based pathfinding visualizer — click to place start, end, and walls
- 🤖 AI Algorithm Solver — describe your problem, get an instant recommendation
- 📊 Complexity comparison panel for all 11 algorithms
- 🔐 JWT authentication with session saving to PostgreSQL
- 🐳 Fully containerized with Docker Compose

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS, Vite |
| Backend | Python Flask, Flask-JWT-Extended, Flask-CORS |
| Database | PostgreSQL 15 |
| AI | Google Gemini API (gemini-1.5-flash) |
| Auth | JWT, bcrypt |
| DevOps | Docker, Docker Compose |
| Hosting | Netlify (frontend), Render (backend) |

---

## Screenshots

| Sorting Visualizer | Graph Visualizer |
|---|---|
| <img width="1917" height="1027" alt="Screenshot 2026-07-21 182817" src="https://github.com/user-attachments/assets/25e4ad06-21d9-42d4-84cc-672a5c6fabeb" /> | <img width="1917" height="1026" alt="Screenshot 2026-07-21 182901" src="https://github.com/user-attachments/assets/be44c873-2453-486e-aac6-c7fe78ef61da" /> |

| Pathfinding Grid | AI Solver |
|---|---|
| <img width="1917" height="1025" alt="Screenshot 2026-07-21 183014" src="https://github.com/user-attachments/assets/3bdb65eb-52ec-45aa-9f54-4762e9cfb642" /> | <img width="1917" height="1022" alt="Screenshot 2026-07-21 183642" src="https://github.com/user-attachments/assets/c900bdbe-bc51-44e2-9e74-b204561de1ba" /> |

---

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker Desktop + WSL2 (Windows) or Docker Engine (Linux/Mac)

### Run with Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/VarunND107/algoviz.git
cd algoviz

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Start all services
docker-compose up --build
```

App will be available at `http://localhost:3000`

### Run without Docker

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
flask run
```

### Environment Variables

Create a `.env` file in the root:

```env
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=algoviz

# Flask
JWT_SECRET_KEY=your_jwt_secret
FLASK_ENV=development

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## Project Structure

```
algoviz/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── pages/            # Route pages
│   │   ├── visualizers/      # Algorithm visualizer components
│   │   │   ├── sorting/      # Bubble, Quick, Merge, etc.
│   │   │   ├── searching/    # Linear, Binary
│   │   │   └── graph/        # BFS, DFS, Dijkstra, Floyd-Warshall
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── app.py                # Flask app + routes
│   ├── requirements.txt
│   └── models/               # DB models
├── docker-compose.yml
└── .env.example
```

---

## Algorithm Complexity Reference

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| BFS | O(V+E) | O(V+E) | O(V+E) | O(V) |
| Dijkstra's | O((V+E)logV) | O((V+E)logV) | O((V+E)logV) | O(V) |
| Floyd-Warshall | O(V³) | O(V³) | O(V³) | O(V²) |

---

## AI Solver

The AI Solver is powered by Google Gemini API. Describe your problem in plain English:

> *"I have a map of cities with distances and need the shortest route"*

And get back: the recommended algorithm, why it fits, and its time/space complexity.

---

## Developer

**Varun ND** — Full Stack Developer, Bengaluru

- Portfolio: [varunnd.netlify.app](https://claude.ai/public/artifacts/9769961b-c06d-47dd-b9ca-597f31532f43)
- LinkedIn: [linkedin.com/in/varunnd-73576731b](https://linkedin.com/in/varunnd-73576731b)
- Fiverr: [fiverr.com/s/99mGvBY](https://fiverr.com/s/99mGvBY)

---

## License

MIT License — feel free to use this for learning.
