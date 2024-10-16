const exerciciosModel = require("../models/exerciciosModel");

async function getExerciciosC(req, res) {
    try {
        const exercicio = await exerciciosModel.getExerciciosM();
        if (!exercicio.length) {
            return res.status(404).json({ error: "Nenhum exercicio encontrado" });
        }
        res.status(200).json(exercicio);
    } catch (error) {
        console.error("Erro ao buscar exercicios:", error);
        res.status(500).json({ error: "Erro ao buscar exercicios" });
    }
}

module.exports = { 
    getExerciciosC,
};