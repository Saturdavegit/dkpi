# Stage de build
FROM node:20-bullseye AS builder

WORKDIR /app

# Arguments de build
ARG APP_URL=http://localhost:3000

# Copie des fichiers de dépendances
COPY package*.json ./
COPY .env.production ./.env.production

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Stage de production
FROM node:20-bullseye AS runner

WORKDIR /app

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production ./.env.production
COPY --from=builder /app/server.js ./server.js

# Variables d'environnement
ENV NODE_ENV=production

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"] 