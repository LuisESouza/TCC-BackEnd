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

async function setTreinoM( nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino,training_stats ) {
    const client = await dbConnect.connect();
    try{
        const sql = "INSERT INTO treino( nome_treino ,id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        const value = [ nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats];
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