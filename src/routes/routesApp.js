const express = require("express");
const userController = require("../controllers/userController.js");
const planoController = require("../controllers/planoController.js");
const exercicioController = require("../controllers/exerciciosController.js");
const authMiddleware = require("./authMiddleware.js");
const feedbackController = require("../controllers/feedbackController.js");

const router = express.Router();

/**
 * Rota POST para registrar um novo usuário.
 * 
 * @route POST /registro
 * @param {string} nome_completo - Nome completo do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} cpf - CPF do usuário.
 * @param {string} senha - Senha do usuário.
 * @returns {Object} Retorna os dados do usuário recém-criado.
 */
router.post('/registro', userController.insertUserC);

/**
 * Rota POST para realizar o login de um usuário.
 * 
 * @route POST /login
 * @param {string} email - Email do usuário.
 * @param {string} senha - Senha do usuário.
 * @returns {Object} Retorna um token JWT se as credenciais forem válidas.
 */
router.post('/login', userController.userLoginC);

/**
 * Rota POST para enviar um e-mail.
 * 
 * @route POST /send-email
 * @param {string} email - O email a ser enviado.
 * @returns {Object} Retorna uma mensagem indicando que o e-mail foi enviado.
 */
router.post('/send-email', userController.sendEmail);

/**
 * Rota POST para registrar o feedback do usuário em relação a um treino.
 * 
 * @route POST /send-rating
 * @param {number} id_user - ID do usuário.
 * @param {number} id_treino - ID do treino.
 * @param {string} feedback - O feedback do usuário.
 * @returns {Object} Retorna a confirmação de que o feedback foi salvo.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.post('/send-rating', authMiddleware, feedbackController.setFeedBackC);

/**
 * Rota POST para criar um novo treino.
 * 
 * @route POST /treino/create
 * @param {Object} treino - Os dados do treino a ser criado.
 * @returns {Object} Retorna o treino criado.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.post('/treino/create', authMiddleware, exercicioController.insertTrainingC);

/**
 * Rota PUT para atualizar o perfil de um usuário.
 * 
 * @route PUT /perfil/update
 * @param {Object} perfil - Os novos dados do perfil a ser atualizado.
 * @returns {Object} Retorna os dados do perfil atualizado.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.put('/perfil/update', authMiddleware, userController.updateUserProfileC);

/**
 * Rota PUT para atualizar a senha de um usuário.
 * 
 * @route PUT /password/update
 * @param {string} email - O e-mail do usuário.
 * @param {string} senha - A nova senha do usuário.
 * @returns {Object} Retorna uma mensagem indicando que a senha foi atualizada.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.put('/password/update', authMiddleware, userController.resetPasswordC);

/**
 * Rota PUT para atualizar os dados de treino de um usuário.
 * 
 * @route PUT /treino/usuario/update
 * @param {Object} treino - Os novos dados do treino a ser atualizado.
 * @returns {Object} Retorna os dados do treino atualizado.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.put('/treino/usuario/update', authMiddleware, exercicioController.putTreinoC);

/**
 * Rota PUT para atualizar os dados de exercícios de um treino.
 * 
 * @route PUT /treino/treino-exercicio/update
 * @param {Object} treinoExercicio - Os novos dados do exercício a ser atualizado.
 * @returns {Object} Retorna os dados do exercício atualizado.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.put('/treino/treino-exercicio/update', authMiddleware, exercicioController.putTreinoExercicioC);

/**
 * Rota GET para buscar o perfil de um usuário.
 * 
 * @route GET /perfil
 * @returns {Object} Retorna os dados do perfil do usuário autenticado.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.get('/perfil', authMiddleware, userController.getUserProfileC);

/**
 * Rota GET para buscar os planos disponíveis.
 * 
 * @route GET /planos
 * @returns {Array} Retorna todos os planos disponíveis.
 * @middleware authMiddleware - Verifica se o usuário está autenticado antes de processar a requisição.
 */
router.get('/planos', authMiddleware, planoController.getPlanosC);

/**
 * Rota GET para buscar os exercícios de um tipo específico.
 * 
 * @route GET /treino/exercicios/tipos/:tipo_exercicio
 * @param {string} tipo_exercicio - O tipo de exercício a ser filtrado.
 * @returns {Array} Retorna os exercícios do tipo especificado.
 */
router.get('/treino/exercicios/tipos/:tipo_exercicio', exercicioController.getExerciciosTiposC);

/**
 * Rota GET para buscar os treinos de um usuário.
 * 
 * @route GET /treino/usuario/:id_cliente
 * @param {number} id_cliente - ID do cliente cujos treinos são buscados.
 * @returns {Array} Retorna todos os treinos do usuário especificado.
 */
router.get('/treino/usuario/:id_cliente', exercicioController.getTreinosC);

module.exports = router;
