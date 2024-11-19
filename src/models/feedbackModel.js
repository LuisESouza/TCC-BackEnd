const dbConnect = require("../../dbConnect");

/**
 * Insere um novo feedback de treino no banco de dados.
 * 
 * @param {number} id_user - O ID do usuário que está deixando o feedback.
 * @param {number} id_treino - O ID do treino ao qual o feedback está associado.
 * @param {string} feedback - O conteúdo do feedback.
 * @returns {Promise<Array>} Um array com os dados do feedback inserido.
 */
async function setFeedBackM(id_user, id_treino, feedback) {
    const client = await dbConnect.connect();
    try {
        const sql = "INSERT INTO feedbacktreinos(id_user, id_treino, feedback) VALUES ($1, $2, $3);";
        const value = [id_user, id_treino, feedback];
        const result = await client.query(sql, value);
        return result.rows;
    } catch (error) {
        console.error("Erro ao inserir feedback:", error);
    } finally {
        client.release();
    }
}

module.exports = {
    setFeedBackM,
};