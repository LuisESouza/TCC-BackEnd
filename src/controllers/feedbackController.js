const feedbackModel = require("../models/feedbackModel");

/**
 * Cria um novo feedback para um treino de um usuário específico.
 * 
 * @async
 * @function setFeedBackC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {number} req.body.id_treino - O ID do treino para o qual o feedback está sendo dado.
 * @param {number} req.body.id_user - O ID do usuário que está fornecendo o feedback.
 * @param {string} req.body.feedback - O conteúdo do feedback fornecido pelo usuário.
 * @returns {Object} Resposta com o status do feedback ou erro.
 * @throws {Error} Se houver erro ao salvar o feedback no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * POST /feedback -> { status: 201, message: "Feedback salvo com sucesso." }
 * 
 * // Exemplo de erro (erro ao salvar o feedback)
 * POST /feedback -> { status: 500, error: "Erro ao salvar feedback." }
 */
async function setFeedBackC(req, res) {
    const { id_treino, id_user, feedback } = req.body;
    try {
        const result = await feedbackModel.setFeedBackM(id_user, id_treino, feedback);
        return res.status(201).json({ message: "Feedback salvo com sucesso", result });
    } catch (error) {
        console.error("Erro ao salvar feedback:", error);
        res.status(500).json({ error: "Erro ao salvar feedback." });
    }
}

module.exports = {
    setFeedBackC,
};