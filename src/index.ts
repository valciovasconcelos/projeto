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

// Iniciar o servidor na porta 8080
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
})