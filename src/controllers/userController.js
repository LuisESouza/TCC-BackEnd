const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

/**
 * Registra um novo usuário.
 * 
 * @async
 * @function insertUserC
 * @param {Object} req - O objeto da requisição, contendo os dados do novo usuário.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Token de autenticação e dados do usuário criado.
 * @throws {Error} Se ocorrer um erro ao registrar o usuário ou se os dados estiverem incompletos.
 * @example
 * // Exemplo de chamada bem-sucedida
 * POST /usuarios -> { token: "jwt-token", user: {...} }
 * 
 * // Exemplo de erro (email já registrado)
 * POST /usuarios -> { error: "Email já registrado." }
 */
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

/**
 * Realiza o login de um usuário.
 * 
 * @async
 * @function userLoginC
 * @param {Object} req - O objeto da requisição, contendo o email e a senha do usuário.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Token de autenticação e dados do usuário.
 * @throws {Error} Se os dados estiverem incorretos ou o login falhar.
 * @example
 * // Exemplo de chamada bem-sucedida
 * POST /login -> { token: "jwt-token", user: {...} }
 * 
 * // Exemplo de erro (email ou senha incorretos)
 * POST /login -> { error: "Email ou senha incorretos." }
 */
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

/**
 * Atualiza o perfil de um usuário autenticado.
 * 
 * @async
 * @function updateUserProfileC
 * @param {Object} req - O objeto da requisição, contendo os dados a serem atualizados.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Dados do perfil atualizado.
 * @throws {Error} Se o token for inválido ou se o perfil não for encontrado.
 * @example
 * // Exemplo de chamada bem-sucedida
 * PUT /perfil -> { altura: 180, peso: 75, objetivo: "Emagrecer", ... }
 * 
 * // Exemplo de erro (token inválido)
 * PUT /perfil -> { error: "Token inválido" }
 */
async function updateUserProfileC(req, res) {
    const { altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const updatedProfile = await userModel.updateUserProfileM(altura, peso, objetivo, hora_treino_inicio, data_treino_inicio, hora_treino_fim, data_treino_fim, userId);
        if (!updatedProfile) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
}

/**
 * Obtém o perfil de um usuário autenticado.
 * 
 * @async
 * @function getUserProfileC
 * @param {Object} req - O objeto da requisição contendo o token de autenticação.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Dados do perfil do usuário.
 * @throws {Error} Se o token for inválido ou se o perfil não for encontrado.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /perfil -> { altura: 180, peso: 75, objetivo: "Emagrecer", ... }
 * 
 * // Exemplo de erro (token inválido)
 * GET /perfil -> { error: "Token inválido" }
 */
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

/**
 * Obtém o plano de um usuário autenticado.
 * 
 * @async
 * @function getUserPlanC
 * @param {Object} req - O objeto da requisição contendo o token de autenticação.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Dados do plano do usuário.
 * @throws {Error} Se o token for inválido ou se o plano não for encontrado.
 * @example
 * // Exemplo de chamada bem-sucedida
 * GET /plano -> { nome: "Premium", ... }
 * 
 * // Exemplo de erro (token inválido)
 * GET /plano -> { error: "Token inválido" }
 */
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

/**
 * Envia um email para recuperação de senha.
 * 
 * @async
 * @function sendEmail
 * @param {Object} req - O objeto da requisição contendo o email do usuário.
 * @param {Object} res - O objeto de resposta.
 * @returns {Object} Mensagem de sucesso ou erro.
 * @throws {Error} Se o envio do email falhar.
 * @example
 * // Exemplo de chamada bem-sucedida
 * POST /recuperar-senha -> { message: "Email enviado com sucesso." }
 * 
 * // Exemplo de erro (email não registrado)
 * POST /recuperar-senha -> { error: "Email não registrado." }
 */
async function sendEmail(req, res) {
    const { email } = req.body;
    try {
        let newPassWord = Math.floor(Math.random() * (20000 - 10000) + 10000).toString();
        if (!email) {
            return res.status(400).json({ error: "Email é obrigatório." });
        }
        const user = await userModel.findUserByEmailM(email);
        if (!user) {
            return res.status(404).json({ error: "Email não registrado." });
        }

        const hashedPassword = await bcrypt.hash(newPassWord, 8);
        const result = await userModel.updatePasswordM(email, hashedPassword);
        if (!result) {
            return res.status(500).json({ error: "Erro ao atualizar a senha." });
        }
        // Configuração do transporter para envio de email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Sua nova senha é: ${newPassWord}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email enviado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao enviar email." });
    }
}

module.exports = {
    insertUserC,
    userLoginC,
    updateUserProfileC,
    getUserProfileC,
    getUserPlanC,
    sendEmail,
};