# Hell.com - Docker Setup

## Quick Start with Docker

### Using Docker Compose (Recommended):
```bash
docker-compose up -d
```

### Using Docker directly:
```bash
# Build
docker build -t hell-com .

# Run
docker run -d -p 3000:3000 --name hell-com hell-com
```

Then open: http://localhost:3000

### Stop:
```bash
docker-compose down
```

## Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Run server
npm start
```

Access at: http://localhost:3000

## Features

- ✅ Captures emails securely
- ✅ Stores submissions in `emails.json`
- ✅ Validates email format
- ✅ Logs timestamps and IPs
- ✅ All secret easter eggs work
- ✅ Runs completely in Docker

## View Captured Emails

```bash
# While container is running
docker exec hell-com cat /app/emails.json

# Or on host machine
cat emails.json
```
