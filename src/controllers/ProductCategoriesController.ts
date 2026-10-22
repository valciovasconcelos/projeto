// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategories";

// Criar o Router do Express
const router = express.Router();

// GET /product-categories - Lista todas as categorias
router.get("/product-categories", async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(ProductCategory);
        const items = await repo.find();
        res.status(200).json(items);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao listar categorias de produto!" });
        return;
    }
});

// GET /product-categories/:id - Visualiza uma categoria pelo ID
router.get("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(ProductCategory);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Categoria não encontrada!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao visualizar categoria de produto!" });
        return;
    }
});

// POST /product-categories - Cadastra uma nova categoria
router.post("/product-categories", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const repo = AppDataSource.getRepository(ProductCategory);
        const newItem = repo.create(data);
        await repo.save(newItem);

        res.status(201).json({
            mensagem: "Categoria de produto cadastrada com sucesso!",
            productCategory: newItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao cadastrar categoria de produto!" });
        return;
    }
});

// PUT /product-categories/:id - Atualiza uma categoria pelo ID
router.put("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const data = req.body;
        const repo = AppDataSource.getRepository(ProductCategory);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Categoria não encontrada!" });
            return;
        }

        repo.merge(item, data);
        const updatedItem = await repo.save(item);

        res.status(200).json({
            mensagem: "Categoria de produto atualizada com sucesso!",
            productCategory: updatedItem,
        });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao atualizar categoria de produto!" });
        return;
    }
});

// DELETE /product-categories/:id - Remove uma categoria pelo ID
router.delete("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const repo = AppDataSource.getRepository(ProductCategory);
        const item = await repo.findOneBy({ id });

        if (!item) {
            res.status(404).json({ mensagem: "Categoria não encontrada!" });
            return;
        }

        await repo.remove(item);

        res.status(200).json({ mensagem: "Categoria de produto removida com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao remover categoria de produto!" });
        return;
    }
});

export default router;
