const dbConnect = require("../../dbConnect");

/**
 * Recupera todos os planos de treinamento do banco de dados.
 * 
 * @returns {Promise<Array>} Um array contendo todos os planos de treinamento cadastrados.
 * Cada item do array representa um plano com seus dados (como id, nome, descrição, preço, etc.).
 */
async function getPlanosM() {
    const client = await dbConnect.connect();
    try {
        const sql = "SELECT * FROM Planos";
        const result = await client.query(sql);
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = { getPlanosM };