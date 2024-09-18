import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { Server } from 'socket.io';
import db from './database.js';
import { fileURLToPath } from 'url';

// Cria as constantes que serão usadas
const app = express();
const server = createServer(app);

// Cria a instância do servidor com as especificações do CORS (para evitar problemas)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define a porta e o host, permitindo que todos se conectem à aplicação
const PORT = 3000;
const HOST = '0.0.0.0';

// Obtém o diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

db.initDB();

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Lida com o desconectamento de algum usuário
io.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  // Envia as mensagens anteriores ao cliente recém-conectado
  db.getLastMessages(10, (err, rows) => {
    if (!err) {
      socket.emit('previousMessages', rows);
    }
  });

  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou');
  });

  // Para enviar a mensagem a todos os clientes conectados
  socket.on('chat message', (msg) => {
    console.log('Mensagem enviada: ' + msg);
    io.emit('chat message', msg);

    db.insertMessage(msg, (err, result) => {
      if (err) {
        console.error('Erro ao inserir mensagem no banco de dados:', err);
        return;
      }
    });
  });
});

// Escuta para ver se o servidor está rodando e exibe a mensagem
server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando no endereço: http://${HOST}:${PORT}`);
});