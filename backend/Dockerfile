FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

# Startup sequence:
# 1. Sync database schema (create/update tables)
# 2. Seed demo users if not present
# 3. Start backend server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && npm start"]
