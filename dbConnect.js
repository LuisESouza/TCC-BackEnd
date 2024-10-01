const { Pool } = require("pg");

let globalConnection;

async function connect() {
    if (globalConnection) {
        return globalConnection.connect();
    }

    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    globalConnection = pool;

    try {
        const client = await pool.connect();
        const res = await client.query("SELECT NOW()");
        console.log("Conectado ao banco de dados:", res.rows[0]);

        client.release();
        return globalConnection.connect();
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;
    }
}

module.exports = {
    connect,
};
