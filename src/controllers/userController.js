const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function insertUserC(req, res) {
    const { nome_completo, email, cpf, senha } = req.body;
    if (!nome_completo || !email || !cpf || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    try {
        const existingUser = await userModel.findUserByEmailM(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email já registrado." });
        }
        const user = await userModel.createUserM(nome_completo, email, cpf, senha);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao registrar" });
    }
}

async function userLoginC(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }
    try {
        const user = await userModel.findUserByEmailM(email);
        if (!user) {
            return res.status(400).json({ error: "Email ou senha incorretos." });
        }
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: "Email ou senha incorretos." });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
}

async function updateUserProfileC(req, res) {
    const { altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim  } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const updatedProfile = await userModel.updateUserProfileM(altura, peso, objetivo,hora_treino_inicio, data_treino_inicio, hora_treino_fim,data_treino_fim , userId);
        if (!updatedProfile) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
}

async function getUserProfileC(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const profile = await userModel.getUserProfileM(userId);
        if (!profile) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
}

async function getUserPlanC(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const profilePlan = await userModel.getUserPlanM(userId);
        if (!profilePlan) {
            return res.status(404).json({ error: "Plano não encontrado" });
        }
        res.status(200).json(profilePlan);
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
}

module.exports = {
    insertUserC,
    userLoginC,
    updateUserProfileC,
    getUserProfileC,
    getUserPlanC
};