const dbConnect = require("../../dbConnect");

/**
 * Retorna todos os exercícios cadastrados no banco de dados.
 * @returns {Promise<Array>} Um array com os dados dos exercícios.
 */
async function getExerciciosM() {
    const client = await dbConnect.connect();
    try {
        const sql = "SELECT * FROM exercicios";
        const result = await client.query(sql);
        return result.rows;
    } finally {
        client.release();
    }
}

/**
 * Retorna os exercícios filtrados pelo tipo de exercício. Se o tipo for 'Todos', retorna todos os exercícios.
 * @param {string} value - O tipo de exercício a ser filtrado (ex: 'Cardio', 'Força', 'Todos').
 * @returns {Promise<Array>} Um array com os dados dos exercícios filtrados.
 */
async function getExerciciosTiposM(value) {
    if (value !== 'Todos') {
        const client = await dbConnect.connect();
        try {
            const sql = "SELECT * FROM exercicios WHERE tipo_exercicio = $1";
            const result = await client.query(sql, [value]);
            return result.rows;
        } finally {
            client.release();
        }
    } else {
        return await getExerciciosM();
    }
}

/**
 * Retorna todos os treinos de um cliente com base no ID do cliente.
 * @param {number} [id_cliente=1] - O ID do cliente. O valor padrão é 1.
 * @returns {Promise<Array>} Um array com os dados dos treinos do cliente.
 */
async function getTreinosM(id_cliente = 1) {
    const client = await dbConnect.connect();
    try{
        const sql = "SELECT * FROM treino WHERE id_cliente = $1";
        const value = [id_cliente];
        const result = await client.query(sql, value);
        return result.rows;
    }finally{
        client.release();
    }
}

/**
 * Retorna os exercícios associados a um treino específico.
 * @param {number} id_treino - O ID do treino.
 * @returns {Promise<Array>} Um array com os dados dos exercícios associados ao treino.
 */
async function getExerciciosPorTreinoM(id_treino) {
    const client = await dbConnect.connect();
    try {
        const sql = `
            SELECT 
                te.id AS treino_exercicio_id,
                e.id AS exercicio_id,
                e.nome_exercicio AS name, 
                te.series, 
                te.repeticoes, 
                te.carga
            FROM 
                treino_exercicios te
            JOIN 
                Exercicios e ON te.id_exercicio = e.id
            WHERE 
                te.id_treino = $1;
        `;
        const values = [id_treino];
        const result = await client.query(sql, values);
        return result.rows;
    } finally {
        client.release();
    }
}

/**
 * Cria um novo treino no banco de dados.
 * @param {string} nome_treino - O nome do treino.
 * @param {number} id_cliente - O ID do cliente que está criando o treino.
 * @param {string} hora_treino_inicio - O horário de início do treino.
 * @param {string} hora_treino_fim - O horário de término do treino.
 * @param {string} data_treino - A data do treino.
 * @param {string} training_stats - Informações sobre o progresso do treino.
 * @returns {Promise<Object>} Os dados do treino recém-criado.
 */
async function setTreinoM(nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats) {
    const client = await dbConnect.connect();
    try {
        const sql = "INSERT INTO treino( nome_treino ,id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        const value = [nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats];
        const result = await client.query(sql, value);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
}

/**
 * Associa um exercício a um treino específico.
 * @param {number} id_treino - O ID do treino.
 * @param {number} id_exercicio - O ID do exercício.
 * @param {number} repeticoes - O número de repetições do exercício.
 * @param {number} series - O número de séries do exercício.
 * @param {number} carga - A carga do exercício.
 * @returns {Promise<void>}
 */
async function setTreinoExercicioM(id_treino, id_exercicio, repeticoes, series, carga) {
    const client = await dbConnect.connect();
    try {
        const sql = "INSERT INTO Treino_Exercicios (id_treino, id_exercicio, repeticoes, series, carga) VALUES ($1, $2, $3, $4, $5)";
        const values = [id_treino, id_exercicio, repeticoes, series, carga];
        await client.query(sql, values);
    } finally {
        client.release();
    }
}

/**
 * Atualiza as informações de treino no banco de dados.
 * @param {string} training_stats - As novas informações de progresso do treino.
 * @param {number} id - O ID do treino a ser atualizado.
 * @returns {Promise<void>}
 */
async function putTreinoM(training_stats, id) {
    const client = await dbConnect.connect();
    try {
        const sql = `
            UPDATE treino 
            SET 
                training_stats = $1
            WHERE id = $2
        `;
        const values = [training_stats, id];
        await client.query(sql, values);
    } catch (error) {
        console.error('Erro ao atualizar treino:', error);
    } finally {
        client.release();
    }
}

/**
 * Atualiza as informações de um exercício em um treino.
 * @param {number} id_exercicio - O ID do exercício a ser atualizado.
 * @param {number} carga - A nova carga do exercício.
 * @param {number} series - O novo número de séries do exercício.
 * @param {number} repeticoes - O novo número de repetições do exercício.
 * @returns {Promise<void>}
 */
async function putTreinoExercicioM(id_exercicio, carga, series, repeticoes) {
    const client = await dbConnect.connect();
    try {
        const updateSql = `
            UPDATE treino_exercicios
            SET repeticoes = $1, series = $2, carga = $3
            WHERE id = $4
        `;
        const updateValues = [repeticoes, series, carga, id_exercicio];
        const result = await client.query(updateSql, updateValues);
        if (result.rowCount > 0) {
            console.log("Treino_exercicio atualizado com sucesso!");
        } else {
            console.error("Nenhum treino_exercicio encontrado com o id fornecido:", id_exercicio);
        }
    } catch (error) {
        console.error("Erro ao atualizar exercício do treino:", error);
    } finally {
        client.release();
    }
}

module.exports = { 
    getExerciciosPorTreinoM,
    putTreinoExercicioM,
    getExerciciosTiposM,
    setTreinoExercicioM,
    getExerciciosM,
    getTreinosM,
    setTreinoM,
    putTreinoM,
};