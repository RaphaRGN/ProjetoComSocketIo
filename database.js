import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Converte __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectando ao banco de dados SQLite
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
        callback(null, { id: this.lastID, message, created_at: new Date().toISOString() });
    });
}

// Função para buscar as últimas N mensagens
function getLastMessages(limit, callback) {
    const query = `SELECT message, created_at FROM messages ORDER BY created_at DESC LIMIT ?`;
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
