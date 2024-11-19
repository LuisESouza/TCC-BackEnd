const planoModel = require("../models/planoModel");

/**
 * Recupera todos os planos disponíveis.
 * 
 * @async
 * @function getPlanosC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Lista de planos ou erro.
 * @throws {Error} Se houver erro ao buscar os planos no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /planos -> { status: 200, planos: [...] }
 * 
 * // Exemplo de erro (nenhum plano encontrado)
 * GET /planos -> { status: 404, error: "Nenhum plano encontrado" }
 * 
 * // Exemplo de erro (erro ao buscar planos)
 * GET /planos -> { status: 500, error: "Erro ao buscar planos" }
 */
async function getPlanosC(req, res) {
    try {
        const planos = await planoModel.getPlanosM();
        if (!planos.length) {
            return res.status(404).json({ error: "Nenhum plano encontrado" });
        }
        res.status(200).json(planos);
    } catch (error) {
        console.error("Erro ao buscar planos:", error);
        res.status(500).json({ error: "Erro ao buscar planos" });
    }
}

module.exports = { getPlanosC };