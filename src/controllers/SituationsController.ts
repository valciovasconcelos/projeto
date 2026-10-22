// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

// Criar o Router do Express
const router = express.Router();

// GET /situations - Lista todas as situações
router.get("/situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);
        const situations = await situationRepository.find();
        res.status(200).json(situations);
        return;
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao listar situações!",
        });
        return;
    }
});

// GET /situations/:id - Visualiza uma situação pelo ID
router.get("/situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!",
            });
            return;
        }

        res.status(200).json(situation);
        return;
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar situação!",
        });
        return;
    }
});

// POST /situations - Cadastra uma nova situação
router.post("/situations", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const situationRepository = AppDataSource.getRepository(Situation);
        const newSituation = situationRepository.create(data);
        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
        return;
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao cadastrar situação!",
        });
        return;
    }
});

// PUT /situations/:id - Atualiza uma situação pelo ID
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const data = req.body;
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!",
            });
            return;
        }

        // Atualiza os dados
        situationRepository.merge(situation, data);

        // Salva as alterações
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situation: updatedSituation,
        });
        return;
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar situação!",
        });
        return;
    }
});

// DELETE /situations/:id - Remove uma situação pelo ID
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!",
            });
            return;
        }

        // Remove os dados do banco de dados
        await situationRepository.remove(situation);

        res.status(200).json({
            mensagem: "Situação removida com sucesso!",
        });
        return;
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover situação!",
        });
        return;
    }
});

// Exportar o router
export default router;