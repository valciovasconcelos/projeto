// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";

// Criar o Router do Express
const router = express.Router();

// GET /products - Lista todos os produtos
router.get("/products", async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(Product);
        const items = await repo.find({
            relations: {
                productSituation: true,
                productCategory: true
            }
        });
        res.status(200).json(items);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao listar produtos!" });
        return;
    }
});

// GET /products/:id - Visualiza um produto pelo ID
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(Product);
        const item = await repo.findOne({
            where: { id },
            relations: {
                productSituation: true,
                productCategory: true
            }
        });

        if (!item) {
            res.status(404).json({ mensagem: "Produto não encontrado!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao visualizar produto!" });
        return;
    }
});

// POST /products - Cadastra um novo produto
router.post("/products", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const repo = AppDataSource.getRepository(Product);
        const newItem = repo.create(data);
        await repo.save(newItem);

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            product: newItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao cadastrar produto!" });
        return;
    }
});

// PUT /products/:id - Atualiza um produto pelo ID
router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const data = req.body;
        const repo = AppDataSource.getRepository(Product);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Produto não encontrado!" });
            return;
        }

        repo.merge(item, data);
        const updatedItem = await repo.save(item);

        res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            product: updatedItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao atualizar produto!" });
        return;
    }
});

// DELETE /products/:id - Remove um produto pelo ID
router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(Product);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Produto não encontrado!" });
            return;
        }

        await repo.remove(item);

        res.status(200).json({ mensagem: "Produto removido com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao remover produto!" });
        return;
    }
});

export default router;
