//importar a biblioteca Express

import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";
// Criar a Aplicação Express 
const router = express.Router();

// inicializar a conexão com bd
AppDataSource.initialize().then(()=>(
    console.log("Conexão do banco de dados realizada com sucesso!")
   
)).catch((error)=>(
    console.log("Erro na conexão com o banco de dados!",error)

))
//Criar a rota GET principal
router.get("/",(req:Request, res:Response) =>{
    res.send("Bem-vindo Pessoal ")
    
})
// Exportar a instrução da rota

export default router