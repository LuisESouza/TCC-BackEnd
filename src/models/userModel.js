const bcrypt = require("bcryptjs");
const dbConnect = require("../../dbConnect");

/**
 * Cria um novo usuário no banco de dados.
 * 
 * @param {string} nome_completo - Nome completo do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} cpf - CPF do usuário.
 * @param {string} senha - Senha do usuário.
 * 
 * @returns {Promise<Object>} O objeto do usuário criado, incluindo os dados como id, nome, email, etc.
 */
async function createUserM(nome_completo, email, cpf, senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const client = await dbConnect.connect();
    try {
        const sql = "INSERT INTO Registro(nome_completo, email, cpf, senha) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [nome_completo, email, cpf, hashedPassword];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Busca um usuário pelo email no banco de dados.
 * 
 * @param {string} email - O email do usuário a ser buscado.
 * 
 * @returns {Promise<Object>} O objeto do usuário encontrado ou `undefined` caso não exista.
 */
async function findUserByEmailM(email) {
    const client = await dbConnect.connect();
    try {
        const sql = "SELECT * FROM Registro WHERE email = $1";
        const values = [email];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Atualiza o perfil de um usuário com novas informações.
 * 
 * @param {number} altura - Altura do usuário.
 * @param {number} peso - Peso do usuário.
 * @param {string} objetivo - Objetivo do usuário (ex: ganhar massa, perder peso, etc).
 * @param {string} hora_treino_inicio - Hora de início do treino.
 * @param {string} data_treino_inicio - Data de início do treino.
 * @param {string} hora_treino_fim - Hora de término do treino.
 * @param {string} data_treino_fim - Data de término do treino.
 * @param {number} userId - ID do usuário (registro).
 * 
 * @returns {Promise<Object>} O objeto atualizado do perfil do usuário.
 */
async function updateUserProfileM(altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim, userId) {
    const client = await dbConnect.connect();
    try {
        const sql = "UPDATE Perfil SET altura = $1, peso = $2, objetivo = $3, hora_treino_inicio = $4, data_treino_inicio = $5, hora_treino_fim = $6, data_treino_fim = $7 WHERE id_registro = $8 RETURNING *";
        const values = [altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim, userId];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Recupera o perfil de um usuário pelo seu ID.
 * 
 * @param {number} userId - ID do usuário (registro).
 * 
 * @returns {Promise<Object>} O objeto do perfil do usuário, incluindo informações como altura, peso, objetivo, etc.
 */
async function getUserProfileM(userId) {
    const client = await dbConnect.connect();
    try {
        const sql = "SELECT * FROM Perfil WHERE id_registro = $1";
        const values = [userId];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Recupera o plano de um usuário com base no seu ID.
 * 
 * @param {number} userId - ID do usuário (registro).
 * 
 * @returns {Promise<Object>} O nome do plano do usuário.
 */
async function getUserPlanM(userId) {
    const client = await dbConnect.connect();
    try {
        const sql = `
            SELECT p.nome AS plano 
            FROM Perfil pf
            JOIN Planos p ON pf.id_plano = p.id
            WHERE pf.id_registro = $1
        `;
        const values = [userId];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Atualiza a senha de um usuário no banco de dados.
 * 
 * @param {string} email - O email do usuário.
 * @param {string} hashedPassword - A nova senha do usuário já criptografada.
 * 
 * @returns {Promise<Object>} O objeto do usuário atualizado.
 */
async function updateUserPasswordM(email, hashedPassword) {
    const client = await dbConnect.connect();
    try {
        const sql = "UPDATE Registro SET senha = $1 WHERE email = $2 RETURNING *";
        const values = [hashedPassword, email];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

module.exports = {
    createUserM,
    findUserByEmailM,
    updateUserProfileM,
    getUserProfileM,
    getUserPlanM,
    updateUserPasswordM
};