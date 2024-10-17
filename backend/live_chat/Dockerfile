# Utiliser une image Node.js comme base
FROM node:18-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server2.js"]
