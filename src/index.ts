// IMPORTAR E CARREGAR VARIAVEIS DE AMBIENTE PRIMEIRO (antes de tudo!)
import dotenv from "dotenv";
dotenv.config()

// Importar a biblioteca Express
import express from "express"

// Importar os controllers
import authController from "./controllers/AuthController"
import situationsController from "./controllers/SituationsController"
import productCategoriesController from "./controllers/ProductCategoriesController"
import productSituationsController from "./controllers/ProductSituationsController"
import productsController from "./controllers/ProductsController"
import usersController from "./controllers/UsersController"
import { AppDataSource } from "./data-source"

// Criar a Aplicação Express
const app = express()

// Middleware para ler JSON no body das requisições
app.use(express.json())

// Registrar as rotas
app.use("/", authController)
app.use("/", situationsController)
app.use("/", productCategoriesController)
app.use("/", productSituationsController)
app.use("/", productsController)
app.use("/", usersController)

const port = Number(process.env.PORT ?? 8080)

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`)
        })
    })
    .catch((error: unknown) => {
        console.error("Erro ao conectar ao banco de dados:", error)
        process.exitCode = 1
    })