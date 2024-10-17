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

module.exports = { 
    getExerciciosM,
    getExerciciosTiposM
};