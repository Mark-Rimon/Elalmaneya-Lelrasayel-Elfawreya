
FROM node:22-bookworm-slim

WORKDIR /app

# Tools needed to compile better-sqlite3 if no prebuilt binary is available
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
