# Elalmaneya Lelrasayel Elfawreya

الشركة الالمانية تقدم لكم خدمة الرسايل الفورية

## Tutorials

- React(20 minutes): https://youtu.be/hn80mWvP-9g?si=RditGhzzpMiP5U2E
- Vite(15 minutes):https://youtu.be/89NJdbYTgJ8?si=7eWU2Z5J2XrLtuK4 
- TypeScript(1 hour):https://youtu.be/d56mG7DezGs?si=Neddf9cEm3Nkq8Xj `[This one is the most important (and consequently the longest)]`
- Node.js(15 minutes):https://youtu.be/ENrzD9HAZK4?si=KBj_lvOTjj7UPCZ3 
- SQLite(20 minutes):https://youtu.be/8Xyn8R9eKB8?si=S_oCFkpQfERAIt1Z 
- better-sqlite3(10 minutes):https://youtu.be/IooIXYf0PIo?si=Nqk0ccXzoF6I0SFM `[You should watch SQLite tutorial first]`
- Docker(10 minutes):https://youtu.be/DQdB7wFEygo?si=bVDDtlMp3pARrohW
- Docker-Compose(15 minutes):https://youtu.be/DM65_JyGxCo?si=DMQjtX4CILtV-2_9 `[This guy's video is painfully loud, also you should watch docker tutorial first]` 
- Git&Github(15 minutes):https://youtu.be/HkdAHXoRtos?si=mSyMRvKOIkOW2_LV `[optional refresher]`

Total Runtime: ~3 hours
## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, TypeScript, Express
- **Database:** SQLite (`better-sqlite3`)
- **Development environment:** Docker Compose

## Prerequisites

Install the following before starting:

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/) with Docker Compose support

You do **not** need to install Node.js, npm, or SQLite directly on your computer to run the application through Docker Compose.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mark-Rimon/Elalmaneya-Lelrasayel-Elfawreya.git
cd Elalmaneya-Lelrasayel-Elfawreya
```

If the repository is private, make sure you have been granted access.

### 2. Build and start the application

From the repository root, run:

```bash
docker compose up --build
```

The first build may take several minutes. Docker downloads the required base images and installs the dependencies.

Once the services have started, open:

- **Frontend:** http://localhost:5173
- **Backend health check:** http://localhost:3000
- **Messages API:** http://localhost:3000/api/messages

The messages endpoint currently returns the messages stored in the SQLite database.

Keep the terminal running while you use the application.

### 3. Stop the application

Press `Ctrl+C` in the terminal running Docker Compose.

To stop and remove the containers and network afterward, run:

```bash
docker compose down
```

Your SQLite database is stored in a Docker-managed volume, so stopping the application this way preserves its data.

**Do not run `docker compose down -v` unless you intentionally want to delete the database volume and its stored data.**

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── compose.yaml
├── .gitignore
└── README.md
```

- `frontend/` — React user interface.
- `backend/` — Express API and SQLite database logic.
- `compose.yaml` — defines how the frontend and backend run together.
- `Dockerfile` — describes how Docker builds each service.

## Useful Docker Commands

Run these from the repository root.

| Command | Purpose |
|---|---|
| `docker compose up` | Start the services |
| `docker compose up --build` | Rebuild images and start the services |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f` | Follow logs from all services |
| `docker compose logs -f backend` | Follow backend logs |
| `docker compose logs -f frontend` | Follow frontend logs |
| `docker compose ps` | Check service status |

## Development Workflow

To keep our work organized:

1. Pull the latest changes before starting new work:

   ```bash
   git switch main
   git pull
   ```

2. Create a separate branch for your task:

   ```bash
   git switch -c feature/your-feature-name
   ```

3. Make and test your changes.

4. Commit your work:

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

5. Push your branch:

   ```bash
   git push -u origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub so the team can review the changes before merging them into `main`.

Replace `your-feature-name` with a short description, such as `login-page` or `message-api`.

## Working on the Frontend or Backend

The project is organized into two separate applications:

- For interface components, pages, styling, and client-side logic, work in `frontend/`.
- For API endpoints, server-side logic, and database operations, work in `backend/`.

After pulling changes that modify dependencies, rebuild the affected Docker image:

```bash
docker compose up --build
```

## Notes

- Do not commit `node_modules/`, build output, local database files, or secrets.
- Commit `package-lock.json` files when dependencies change so everyone installs consistent dependency versions.
- The SQLite database is managed by the backend and persisted in a Docker volume.
- Keep `main` stable and use feature branches for development.

