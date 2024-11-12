const express = require("express");
const userController = require("../controllers/userController.js");
const planoController = require("../controllers/planoController.js");
const exercicioController = require("../controllers/exerciciosController.js");
const authMiddleware = require("./authMiddleware.js");
const feedbackController = require("../controllers/feedbackController.js");

const router = express.Router();
//ROUTER POST
router.post('/registro', userController.insertUserC);
router.post('/login', userController.userLoginC);
router.post('/send-email', userController.sendEmail);
router.post('/send-rating', authMiddleware, feedbackController.setFeedBackC);
router.post('/treino/create', authMiddleware, exercicioController.insertTrainingC);


//ROUTER PUT
router.put('/perfil/update', authMiddleware, userController.updateUserProfileC);
router.put('/password/update', authMiddleware, userController.resetPasswordC);

router.put('/treino/usuario/update', authMiddleware, exercicioController.putTreinoC);
router.put('/treino/treino-exercicio/update', authMiddleware, exercicioController.putTreinoExercicioC);

//ROUTER GET
router.get('/perfil', authMiddleware, userController.getUserProfileC);
router.get('/planos', authMiddleware, planoController.getPlanosC);

router.get('/treino/exercicios/tipos/:tipo_exercicio', exercicioController.getExerciciosTiposC);
router.get('/treino/usuario/:id_cliente', exercicioController.getTreinosC);
// router.get('/dieta');authMiddleware,

module.exports = router;