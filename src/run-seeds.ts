import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds"

const runSeeds = async () => {
    console.log("Conectando ao banco de dados..")
    await AppDataSource.initialize();
    console.log("Banco de dados conectado!")

    try {
        // Cria a instância da classe de seed
        const situationSeeds = new CreateSituationsSeeds();
        // Executa a seed
        await situationSeeds.run(AppDataSource);

    } catch (error) {
        console.log("Erro ao executar o seed", error);

    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};

runSeeds();