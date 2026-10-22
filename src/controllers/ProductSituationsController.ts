// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";

// Criar o Router do Express
const router = express.Router();

// GET /product-situations - Lista todas as situações de produto
router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(ProductSituation);
        const items = await repo.find();
        res.status(200).json(items);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao listar situações de produto!" });
        return;
    }
});

// GET /product-situations/:id - Visualiza uma situação de produto pelo ID
router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(ProductSituation);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Situação de produto não encontrada!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao visualizar situação de produto!" });
        return;
    }
});

// POST /product-situations - Cadastra uma nova situação de produto
router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const repo = AppDataSource.getRepository(ProductSituation);
        const newItem = repo.create(data);
        await repo.save(newItem);

        res.status(201).json({
            mensagem: "Situação de produto cadastrada com sucesso!",
            productSituation: newItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao cadastrar situação de produto!" });
        return;
    }
});

// PUT /product-situations/:id - Atualiza uma situação de produto pelo ID
router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const data = req.body;
        const repo = AppDataSource.getRepository(ProductSituation);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Situação de produto não encontrada!" });
            return;
        }

        repo.merge(item, data);
        const updatedItem = await repo.save(item);

        res.status(200).json({
            mensagem: "Situação de produto atualizada com sucesso!",
            productSituation: updatedItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao atualizar situação de produto!" });
        return;
    }
});

// DELETE /product-situations/:id - Remove uma situação de produto pelo ID
router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(ProductSituation);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Situação de produto não encontrada!" });
            return;
        }

        await repo.remove(item);

        res.status(200).json({ mensagem: "Situação de produto removida com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao remover situação de produto!" });
        return;
    }
});

export default router;
