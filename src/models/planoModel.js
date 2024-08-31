const dbConnect = require("../../dbConnect");

async function getPlanosM() {
    const client = await dbConnect.connect();
    try {
        const sql = "SELECT * FROM Planos";
        const result = await client.query(sql);
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = { getPlanosM };
