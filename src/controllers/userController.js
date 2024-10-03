const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { consumers } = require("nodemailer/lib/xoauth2");

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

async function resetPasswordC(req, res) {
    const { email, senha } = req.body;
    try{
        if(!email, !senha){
            return;
        }
        const hashedPassword = await bcrypt.hash(senha, 10);
        updateUser = await userModel.updateUserPasswordM(email, hashedPassword);
    }catch(error){
        res.status
    }
}

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

        const hashedPassword = await bcrypt.hash(newPassWord, 10);
        const updatedUser = await userModel.updateUserPasswordM(email, hashedPassword);

        if (!updatedUser) {
            return res.status(500).json({ error: "Erro ao atualizar senha." });
        }

        const sender = {
            email: "dicefitemail@gmail.com",
            pass: "tujc pjym jgpv lycs"
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender.email,
                pass: sender.pass
            }
        });

        let mailOptions = {
            from: sender.email,
            to: email,
            subject: 'Recuperar Senha',
            html: `<h1>Recuperar Senha</h1><p><strong>Nova senha:</strong> ${newPassWord}</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erro ao enviar email:", error);
                return res.status(500).json({ error: "Erro ao enviar email." });
            } else {
                console.log('Email enviado: ' + info.response);
                return res.status(200).json({ message: "Email enviado com sucesso." });
            }
        });
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return res.status(500).json({ error: "Erro ao enviar email." });
    }
}


module.exports = {
    insertUserC,
    userLoginC,
    updateUserProfileC,
    getUserProfileC,
    getUserPlanC,
    sendEmail,
    resetPasswordC
};