const exerciciosModel = require("../models/exerciciosModel");

/**
 * Recupera todos os exercícios cadastrados no banco de dados.
 * 
 * @async
 * @function getExerciciosC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Resposta com status e dados dos exercícios ou erro.
 * @throws {Error} Se houver erro ao consultar os exercícios no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /exercicios -> { status: 200, exercicios: [...] }
 * 
 * // Exemplo de erro (nenhum exercício encontrado)
 * GET /exercicios -> { status: 404, error: "Nenhum exercício encontrado" }
 */
async function getExerciciosC(req, res) {
    try {
        const exercicio = await exerciciosModel.getExerciciosM();
        if (!exercicio.length) {
            return res.status(404).json({ error: "Nenhum exercício encontrado" });
        }
        res.status(200).json(exercicio);
    } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        res.status(500).json({ error: "Erro ao buscar exercícios" });
    }
}

/**
 * Recupera exercícios por tipo, com base no parâmetro `tipo_exercicio`.
 * 
 * @async
 * @function getExerciciosTiposC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.params.tipo_exercicio - O tipo de exercício a ser consultado.
 * @returns {Object} Resposta com status e dados dos exercícios filtrados por tipo ou erro.
 * @throws {Error} Se houver erro ao consultar os exercícios no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /exercicios/tipo/pesada -> { status: 200, exercicios: [...] }
 * 
 * // Exemplo de erro (nenhum exercício encontrado)
 * GET /exercicios/tipo/pesada -> { status: 404, error: "Nenhum exercício encontrado" }
 */
async function getExerciciosTiposC(req, res) {
    const { tipo_exercicio } = req.params;
    try {
        const exercicio = await exerciciosModel.getExerciciosTiposM(tipo_exercicio);
        if (!exercicio.length) {
            return res.status(404).json({ error: "Nenhum exercício encontrado" });
        }
        res.status(200).json(exercicio);
    } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        res.status(500).json({ error: "Erro ao buscar exercícios" });
    }
}

/**
 * Cria um novo treino para um cliente, associando exercícios ao treino.
 * 
 * @async
 * @function insertTrainingC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.body.nome_treino - O nome do treino.
 * @param {number} req.body.id_cliente - O ID do cliente associado ao treino.
 * @param {string} req.body.hora_treino_inicio - Hora de início do treino.
 * @param {string} req.body.hora_treino_fim - Hora de fim do treino.
 * @param {string} req.body.data_treino - Data do treino.
 * @param {Array} req.body.exercicios_id - Lista de exercícios associados ao treino.
 * @param {number} req.body.repeticoes - Número de repetições dos exercícios.
 * @param {number} req.body.series - Número de séries dos exercícios.
 * @param {number} req.body.carga - Carga dos exercícios.
 * @param {Object} req.body.training_stats - Estatísticas do treino.
 * @returns {Object} Resposta com status de sucesso e dados do treino criado ou erro.
 * @throws {Error} Se houver erro ao criar o treino ou associar os exercícios.
 * @example
 * // Exemplo de chamada bem-sucedida
 * POST /treino -> { status: 201, message: "Treino criado com sucesso", treino: {...} }
 * 
 * // Exemplo de erro (campos obrigatórios não preenchidos)
 * POST /treino -> { status: 400, error: "Preencha todos os campos." }
 */
async function insertTrainingC(req, res) {
    const { nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, exercicios_id, repeticoes, series, carga, training_stats } = req.body;
    if (!nome_treino || !id_cliente || !data_treino || !exercicios_id || !exercicios_id.length) {
        return res.status(400).json({ error: "Preencha todos os campos." });
    }
    try {
        const treino = await exerciciosModel.setTreinoM(nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats);
        for (const exercicio of exercicios_id) {
            await exerciciosModel.setTreinoExercicioM(treino.id, exercicio.id_exercicio, repeticoes, series, carga);
        }
        res.status(201).json({ message: "Treino criado com sucesso", treino });
    } catch (error) {
        console.error("Erro ao criar treino:", error);
        res.status(500).json({ error: "Erro ao criar treino" });
    }
}

/**
 * Recupera todos os treinos de um cliente específico, incluindo os exercícios associados.
 * 
 * @async
 * @function getTreinosC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.params.id_cliente - O ID do cliente cujos treinos devem ser retornados.
 * @param {Object} req.params.training_stats - Filtro de estatísticas de treino.
 * @returns {Object} Resposta com status e dados dos treinos do cliente ou erro.
 * @throws {Error} Se houver erro ao consultar os treinos ou associar os exercícios.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /treinos/cliente/1/stats/ativo -> { status: 200, treinos: [...] }
 * 
 * // Exemplo de erro (erro ao buscar treinos)
 * GET /treinos/cliente/1/stats/ativo -> { status: 500, error: "Erro ao buscar treinos" }
 */
async function getTreinosC(req, res) {
    const { id_cliente, training_stats } = req.params;
    try {
        const treinos = await exerciciosModel.getTreinosM(id_cliente, training_stats);
        for (let treino of treinos) {
            const exercicios = await exerciciosModel.getExerciciosPorTreinoM(treino.id, treino.training_stats);
            treino.exercicios = exercicios;
        }
        res.status(200).json(treinos);
    } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        res.status(500).json({ error: "Erro ao buscar treinos" });
    }
}

/**
 * Atualiza as estatísticas de um treino específico.
 * 
 * @async
 * @function putTreinoC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.body.training_stats - As novas estatísticas do treino.
 * @param {number} req.body.id - O ID do treino a ser atualizado.
 * @returns {Object} Resposta com status de sucesso ou erro.
 * @throws {Error} Se houver erro ao atualizar o treino no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * PUT /treino -> { status: 200, treinos: {...} }
 * 
 * // Exemplo de erro (erro ao atualizar o treino)
 * PUT /treino -> { status: 500, error: "Erro ao atualizar treino" }
 */
async function putTreinoC(req, res) {
    const { training_stats, id } = req.body;
    try {
        const treinos = await exerciciosModel.putTreinoM(training_stats, id);
        res.status(200).json(treinos);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Atualiza os dados de um exercício específico em um treino.
 * 
 * @async
 * @function putTreinoExercicioC
 * @param {Object} req - O objeto da requisição.
 * @param {Object} res - O objeto de resposta.
 * @param {number} req.body.id_exercicio - O ID do exercício a ser atualizado.
 * @param {number} req.body.carga - A nova carga do exercício.
 * @param {number} req.body.series - O número de séries do exercício.
 * @param {number} req.body.repeticoes - O número de repetições do exercício.
 * @returns {Object} Resposta com status de sucesso ou erro.
 * @throws {Error} Se houver erro ao atualizar o exercício no banco de dados.
 * @example
 * // Exemplo de chamada bem-sucedida
 * PUT /treino/exercicio -> { status: 200, message: "Exercício atualizado com sucesso" }
 * 
 * // Exemplo de erro (erro ao atualizar exercício)
 * PUT /treino/exercicio -> { status: 500, error: "Erro ao atualizar exercício" }
 */
async function putTreinoExercicioC(req, res) {
    const { id_exercicio, carga, series, repeticoes } = req.body;
    try {
        const treinos = await exerciciosModel.putTreinoExercicioM(id_exercicio, carga, series, repeticoes);
        res.status(200).json(treinos);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getExerciciosC,
    getExerciciosTiposC,
    insertTrainingC,
    getTreinosC,
    putTreinoC,
    putTreinoExercicioC
};
