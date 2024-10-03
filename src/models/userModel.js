const bcrypt = require("bcryptjs");
const dbConnect = require("../../dbConnect");

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

async function updateUserProfileM(altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim,data_treino_fim, userId) {
    const client = await dbConnect.connect();
    try {
        const sql = "UPDATE Perfil SET altura = $1, peso = $2, objetivo = $3, hora_treino_inicio = $4,data_treino_inicio = $5,hora_treino_fim  = $6,data_treino_fim  = $7 WHERE id_registro = $8 RETURNING *";

        const values = [altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim, userId];
        const result = await client.query(sql, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

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