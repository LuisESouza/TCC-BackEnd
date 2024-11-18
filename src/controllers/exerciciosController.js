const exerciciosModel = require("../models/exerciciosModel");
async function getExerciciosC(req, res) {
    try {
        const exercicio = await exerciciosModel.getExerciciosM();
        if (!exercicio.length) {
            return res.status(404).json({ error: "Nenhum exercício encontrado" });
        }
        res.status(200).json(exercicio);
    } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        res.status(500).json({ error: "Erro ao buscar exercícios" });
    }
}
async function getExerciciosTiposC(req, res) {
    const { tipo_exercicio } = req.params;
    try {
        const exercicio = await exerciciosModel.getExerciciosTiposM(tipo_exercicio);
        if (!exercicio.length) {
            return res.status(404).json({ error: "Nenhum exercício encontrado" });
        }
        res.status(200).json(exercicio);
    } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        res.status(500).json({ error: "Erro ao buscar exercícios" });
    }
}
async function insertTrainingC(req, res) {
    const { nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, exercicios_id, repeticoes, series, carga, training_stats } = req.body;
    if (!nome_treino || !id_cliente || !data_treino || !exercicios_id || !exercicios_id.length) {
        return res.status(400).json({ error: "Preencha todos os campos." });
    }
    try {
        const treino = await exerciciosModel.setTreinoM(nome_treino, id_cliente, hora_treino_inicio, hora_treino_fim, data_treino, training_stats);
        for (const exercicio of exercicios_id) {
            await exerciciosModel.setTreinoExercicioM(treino.id, exercicio.id_exercicio, repeticoes, series, carga);
        }
        res.status(201).json({ message: "Treino criado com sucesso", treino });
    } catch (error) {
        console.error("Erro ao criar treino:", error);
        res.status(500).json({ error: "Erro ao criar treino" });
    }
}
async function getTreinosC(req, res) {
    const { id_cliente, training_stats } = req.params;
    try {
        const treinos = await exerciciosModel.getTreinosM(id_cliente,training_stats);
        for (let treino of treinos) {
            const exercicios = await exerciciosModel.getExerciciosPorTreinoM(treino.id, treino.training_stats);
            treino.exercicios = exercicios;
        }
        res.status(200).json(treinos);
    } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        res.status(500).json({ error: "Erro ao buscar treinos" });
    }
}
async function putTreinoC(req, res) {
    const { training_stats, id } = req.body
    try{
        const treinos = await exerciciosModel.putTreinoM(training_stats, id);
        res.status(200).json(treinos);
    }catch(error){
        console.log(error);
    }
}
async function putTreinoExercicioC(req, res) {
    //
    const { id_treino, id_exercicio, carga, series, repeticoes } = req.body
    try{
        const treinos = await exerciciosModel.putTreinoExercicioM(id_exercicio, carga, series, repeticoes);
        res.status(200).json(treinos);
    }catch(error){
        console.log(error);
    }
}

module.exports = { 
    putTreinoExercicioC,
    getExerciciosTiposC,
    insertTrainingC,
    getExerciciosC,
    getTreinosC,
    putTreinoC,
};