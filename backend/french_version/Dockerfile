# Utiliser une image Python
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers requirements.txt dans l'image
COPY requirements.txt requirements.txt

# Installer les dépendances
RUN pip install -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port 8080
EXPOSE 8080

# Définir la commande pour lancer l'application
CMD ["gunicorn", "-b", ":8080", "controleur:app"]
