const { Pool } = require("pg");

let globalConnection;

/**
 * Função responsável por estabelecer a conexão com o banco de dados.
 * Utiliza o Pool do `pg` para gerenciar a conexão e garantir que não haja múltiplas conexões abertas.
 * Se a conexão global (`globalConnection`) já existir, ela será reutilizada para novas consultas.
 * 
 * @returns {Promise} - Retorna a conexão com o banco de dados.
 * 
 * Caso a conexão falhe, um erro será lançado.
 */
async function connect() {
    if (globalConnection) {
        return globalConnection.connect();  // Reutiliza a conexão existente
    }

    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false,  // Configuração para permitir conexões SSL seguras
        },
    });

    globalConnection = pool;  // Salva a instância do pool para futuras conexões

    try {
        const client = await pool.connect();
        const res = await client.query("SELECT NOW()");  // Testa a conexão
        console.log("Conectado ao banco de dados:", res.rows[0]);

        client.release();  // Libera o client após o teste
        return globalConnection.connect();  // Retorna a conexão para uso
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;  // Lança o erro se a conexão falhar
    }
}

module.exports = {
    connect,
};
