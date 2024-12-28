# Étape 1 : Construire l'application React
FROM node:18-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application React
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de build générés par React dans le répertoire d'hébergement par défaut de Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
