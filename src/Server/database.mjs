import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
const {Pool} = pkg;

// Configurações do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const pool = new Pool({
    user: 'postgres',         
    host: 'localhost',       
    database: 'Sentinel',  
    password: 'root',  
    port: 5432,              
  });
  
  // Função para inicializar a tabela de mensagens
  function initDB() {
    pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS app_users (
        id SERIAL PRIMARY KEY,
        profile TEXT NOT NULL,
        canSendMessages BOOLEAN NOT NULL
      );
    `).catch(err => console.error('Erro ao criar tabelas:', err));
  }
  
  // Função para inserir uma nova mensagem
  function insertMessage(message, callback) {
    const query = `INSERT INTO messages (message, created_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *`;
    pool.query(query, [message], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.rows[0]);
    });
  }
  
  // Função para buscar as últimas mensagens
  function getLastMessages(limit, callback) {
    const query = `SELECT message, created_at FROM messages ORDER BY created_at DESC LIMIT $1`;
    pool.query(query, [limit], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.rows);
    });
  }
  
  // Função para checar as permissões do usuário
  function checkUserPermission(username, callback) {
    const query = `SELECT canSendMessages FROM app_users WHERE profile = $1`;
    pool.query(query, [username], (err, result) => {
      if (err) {
        return callback(err);
      }
      const row = result.rows[0];
      callback(null, row ? row.cansendmessages : false);
    });
  }

// Exportando as funções do banco de dados
export default {
    initDB,
    insertMessage,
    getLastMessages,
    checkUserPermission
};
