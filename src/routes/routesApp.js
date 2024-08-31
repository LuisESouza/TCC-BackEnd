const express = require("express");
const userController = require("../controllers/userController.js");
const planoController = require("../controllers/planoController.js")
const authMiddleware = require("./authMiddleware.js");

const router = express.Router();

router.post('/registro', userController.insertUserC);
router.post('/login', userController.userLoginC);
router.put('/perfil/update', authMiddleware, userController.updateUserProfileC);
router.get('/perfil', authMiddleware, userController.getUserProfileC);

router.get('/planos', authMiddleware, planoController.getPlanosC);
// router.get('/treino');
// router.get('/dieta');

module.exports = router;