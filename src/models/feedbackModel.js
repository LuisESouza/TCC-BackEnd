const dbConnect = require("../../dbConnect");

async function setFeedBackM(id_user, id_treino, feedback){
    const client = await dbConnect.connect();
    try{
        const sql = "INSERT INTO feedbacktreinos(id_user, id_treino, feedback) VALUES ( $1, $2, $3);";
        const value = [ id_user, id_treino, feedback];
        const result = await client.query(sql, value);
        return result.rows;
    }catch(error){
        console.log(error);
    }
}

module.exports = { 
    setFeedBackM,
};