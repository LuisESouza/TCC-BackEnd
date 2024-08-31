const planoModel = require("../models/planoModel");

async function getPlanosC(req, res) {
    try {
        const planos = await planoModel.getPlanosM();
        if (!planos.length) {
            return res.status(404).json({ error: "Nenhum plano encontrado" });
        }
        res.status(200).json(planos);
    } catch (error) {
        console.error("Erro ao buscar planos:", error);
        res.status(500).json({ error: "Erro ao buscar planos" });
    }
}

module.exports = { getPlanosC };