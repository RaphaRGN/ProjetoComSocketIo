import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurações do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new sqlite3.Database(path.join(__dirname, 'messages.db'));
//const userInput = document.getElementById("inputAutenticator");

// Função para inicializar a tabela de mensagens
function initDB() {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        created_at DATETIME
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            canSendMessages INTEGER NOT NULL CHECK (CanSendMessages IN (0, 1))
            
            )`);
}

// Função para obter o horário atual no formato correto para o fuso "America/Sao_Paulo"
function getFormattedDate() {
    const date = new Date();
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

// Função para inserir uma nova mensagem
function insertMessage(message, callback) {
    const query = `INSERT INTO messages (message, created_at) VALUES (?, ?)`;
    const createdAt = getFormattedDate();  // Usa a data formatada corretamente
    db.run(query, [message, createdAt], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, message, created_at: createdAt });
    });
}

// Função para buscar as últimas mensagens
function getLastMessages(limit, callback) {
    const query = `SELECT message, created_at FROM messages ORDER BY created_at DESC LIMIT ?`;
    db.all(query, [limit], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
}

function checkUserPermission(username, callback) {
  const query = `SELECT canSendMessages FROM users WHERE user = ?`;
  db.get(query, [username], (err, row) => {
      if (err) {
          return callback(err);
      }
      callback(null, row ? row.canSendMessages === 1 : false);
  });
}


// Exportando as funções do banco de dados
export default {
    initDB,
    insertMessage,
    getLastMessages,
    checkUserPermission
};
