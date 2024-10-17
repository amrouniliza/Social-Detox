# Étape 1: Construction de l'application Angular
FROM node:18 AS build-stage

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Angular pour la production
RUN npm run build --prod

# Étape 2: Serveur NGINX pour servir les fichiers statiques
FROM nginx:alpine AS production-stage

# Copier les fichiers générés dans le dossier nginx
COPY --from=build-stage /app/dist/* /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
