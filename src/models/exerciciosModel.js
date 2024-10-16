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


module.exports = { 
    getExerciciosM
};