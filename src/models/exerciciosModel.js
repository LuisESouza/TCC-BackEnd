const dbConnect = require("../../dbConnect");
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
async function getTreinosM(id_cliente = 1) {
    const client = await dbConnect.connect();
    try{
        const sql = "SELECT * FROM treino WHERE id_cliente = $1";
        const value = [id_cliente]
        const result = await client.query(sql, value);
        return result.rows;
    }finally{
        client.release();
    }
}
async function getExerciciosPorTreinoM(id_treino) {
    const client = await dbConnect.connect();
    try {
        const sql = `
            SELECT e.id, e.nome_exercicio AS name, te.series, te.repeticoes, te.carga 
            FROM Treino_Exercicios te
            JOIN Exercicios e ON te.id_exercicio = e.id
            WHERE te.id_treino = $1
        `;
        const values = [id_treino];
        const result = await client.query(sql, values);
        return result.rows;
    } finally {
        client.release();
    }
}

async function setTreinoM( nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino ) {
    const client = await dbConnect.connect();
    try{
        const sql = "INSERT INTO treino( nome_treino ,id_cliente, hora_treino_inicio, hora_treino_fim, data_treino) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const value = [ nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino];
        const result = await client.query(sql, value);
        return result.rows[0];
    }catch(error){
        console.log(error)
    }
}
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
module.exports = { 
    getExerciciosM,
    getExerciciosTiposM,
    setTreinoM,
    setTreinoExercicioM,
    getTreinosM,
    getExerciciosPorTreinoM
};