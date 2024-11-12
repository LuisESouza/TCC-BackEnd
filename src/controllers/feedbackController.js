const feedbackModel = require("../models/feedbackModel");

async function setFeedBackC(req, res) {
    const { id_treino, id_user, feedback } = req.body
    try{    
        const result = await feedbackModel.setFeedBackM(id_user, id_treino, feedback);
        return result;
    }catch(error){
        console.log(error);
    }
}


module.exports = {
    setFeedBackC,
}