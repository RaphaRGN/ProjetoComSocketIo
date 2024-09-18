import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurações do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new sqlite3.Database(path.join(__dirname, 'messages.db'));

// Função para inicializar a tabela de mensagens
function initDB() {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}


// Função para inserir uma nova mensagem
function insertMessage(message, callback) {
    const query = `INSERT INTO messages (message) VALUES (?)`;
    db.run(query, [message], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, message, created_at: Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) });
    });
}

// Função para buscar as últimas N mensagens
function getLastMessages(limit, callback) {
    const query = `SELECT message, created_at FROM messages ORDER BY created_at ASC LIMIT ?`;
    db.all(query, [limit], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
}

// Exportando as funções do banco de dados
export default {
    initDB,
    insertMessage,
    getLastMessages
};