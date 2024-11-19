const jwt = require("jsonwebtoken");

/**
 * Middleware de autenticação para verificar se o usuário forneceu um token JWT válido.
 * 
 * Este middleware verifica se o token JWT foi incluído no cabeçalho da requisição (Authorization) e valida sua autenticidade.
 * Se o token for válido, os dados decodificados do token são anexados à requisição (`req.user`) para uso em rotas subsequentes.
 * Caso contrário, retorna um erro de autenticação com status `401`.
 * 
 * @param {Object} req - O objeto de requisição (request).
 * @param {Object} res - O objeto de resposta (response).
 * @param {Function} next - A função que passa o controle para o próximo middleware ou rota.
 * 
 * @returns {void} - Se o token for válido, o controle é passado para o próximo middleware ou rota. Caso contrário, um erro é retornado.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  // Verifica se o token foi fornecido
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Valida o token usando a chave secreta definida no ambiente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Anexa os dados decodificados à requisição
    next(); // Passa o controle para o próximo middleware ou rota
  } catch (error) {
    res.status(401).json({ message: 'Token não é válido' }); // Caso o token seja inválido
  }
};

module.exports = authMiddleware;