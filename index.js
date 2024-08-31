require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routesApp = require("./src/routes/routesApp");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get("/", (req, res) => {res.json({ message: "Funcionando!" });});
app.use('/api/dicefit', routesApp);

app.listen(port, () => {
    console.log(`BackEnd rodando: http://localhost:${port}`);
});