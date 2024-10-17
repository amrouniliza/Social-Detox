import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors'; 

// Définition de la classe IOController
class IOController {
  constructor(io) {
    this.clients = new Map(); // Stocke les utilisateurs connectés
    this.io = io; // Référence au serveur Socket.io
  }

  // Méthode pour enregistrer un socket nouvellement connecté
  registerSocket(socket) {
    console.log(`New connection with id ${socket.id}`);
    this.setupListeners(socket); // Configuration des écouteurs d'événements pour le socket
  }

  // Configure les écouteurs d'événements pour un socket donné
  setupListeners(socket) {
    socket.on('joinChat', (username) => {
      this.addUserToChat(socket, username); // Ajout de l'utilisateur au chat
    });

    socket.on('leaveChat', () => {
      this.leave(socket); // Gestion de la déconnexion
    });

    socket.on('sendMsg', (msg) => {
      this.sendMessage(socket, msg); // Gestion de l'envoi des messages
    });
  }

  // Ajoute un utilisateur au chat
  addUserToChat(socket, username) {
    console.log(`joinChat received from ${username} (id: ${socket.id})`);
    this.clients.set(socket.id, username); // Stocke l'ID du socket et le nom d'utilisateur
    socket.broadcast.emit('welcome', username); // Envoie un message de bienvenue à tous les autres utilisateurs
  }

  // Gestion de la déconnexion d'un utilisateur
  leave(socket) {
    const userName = this.clients.get(socket.id) || 'unknown'; // Récupère le nom d'utilisateur à partir de l'ID du socket
    this.io.emit('userDisconected', userName); // Informe les autres utilisateurs de la déconnexion
    this.clients.delete(socket.id); // Supprime l'utilisateur de la liste des clients
    console.log(`Disconnection from ${socket.id} (user: ${userName})`);
  }

  // Gestion de l'envoi de messages
  sendMessage(socket, msg) {
    const userName = this.clients.get(socket.id) || 'unknown'; // Récupère le nom d'utilisateur associé au socket
    socket.broadcast.emit('receivedMsg', msg, userName); // Envoie le message aux autres utilisateurs
  }
}

// Partie Express et Socket.io
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // Crée une application Express
const server = http.createServer(app); // Crée un serveur HTTP avec Express
const io = new Server(server); // Initialise Socket.io avec le serveur HTTP
const ioController = new IOController(io); // Crée une instance de IOController

// Servir les fichiers statiques
app.use(express.static('templates'));
app.use(cors())
// Route pour servir la page de chat
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/templates/chat.html');
});


app.get('/chat1', (req, res) => {
  res.sendFile(__dirname + '/templates/chat1.html');
});

// Gérer les connexions Socket.io
io.on('connection', (socket) => {
  ioController.registerSocket(socket); // Enregistre chaque socket nouvellement connecté
});

// Démarrer le serveur
server.listen(8080, () => {
  console.log('Serveur en cours d\'exécution sur http://localhost:8000');
});
