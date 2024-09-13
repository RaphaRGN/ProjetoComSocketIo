//Rege as regras básicas do server

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

//criar as const que serão usadas

const app = express();
const server = createServer(app);
const io = new Server(server);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(join(__dirname, 'public')));

//Conecta ao HTML

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

//Lida com o desconectamento de algum usuáro

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  

  // para enviar a mensagem a todos os clientes conectados

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); 
  });
});

//Escuta para ver se o server está rodando, então, exibe a mensagem

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
