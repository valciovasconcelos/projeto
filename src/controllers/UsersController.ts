import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { User } from "../entity/Users";

const router = express.Router();

const parseId = (value: string | string[]): number => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : NaN;
};

const publicUser = (user: User) => {
    const { password, ...data } = user;
    return data;
};

const databaseErrorCode = (error: unknown): string | undefined => {
    if (typeof error !== "object" || error === null || !("driverError" in error)) {
        return undefined;
    }

    const driverError = error.driverError;
    if (typeof driverError !== "object" || driverError === null || !("code" in driverError)) {
        return undefined;
    }

    return typeof driverError.code === "string" ? driverError.code : undefined;
};

router.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await AppDataSource.getRepository(User).find({
            relations: { situation: true },
            order: { id: "ASC" },
        });

        res.status(200).json(users.map(publicUser));
    } catch {
        res.status(500).json({ mensagem: "Erro ao listar usuários!" });
    }
});

router.get("/users/:id", async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID de usuário inválido!" });
        return;
    }

    try {
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id },
            relations: { situation: true },
        });

        if (!user) {
            res.status(404).json({ mensagem: "Usuário não encontrado!" });
            return;
        }

        res.status(200).json(publicUser(user));
    } catch {
        res.status(500).json({ mensagem: "Erro ao visualizar usuário!" });
    }
});

router.post("/users", async (req: Request, res: Response) => {
    const { name, email, password, situationId } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" ||
        !password.trim()) {
        res.status(400).json({ mensagem: "Informe nome, e-mail válido e senha!" });
        return;
    }

    try {
        let situation: Situation | undefined;
        if (situationId !== undefined && situationId !== null) {
            const id = Number(situationId);
            if (!Number.isInteger(id) || id < 1) {
                res.status(400).json({ mensagem: "ID de situação inválido!" });
                return;
            }

            situation = await AppDataSource.getRepository(Situation).findOneBy({ id }) ?? undefined;
            if (!situation) {
                res.status(400).json({ mensagem: "A situação informada não existe!" });
                return;
            }
        }

        const repository = AppDataSource.getRepository(User);
        const user = repository.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            ...(situation ? { situation } : {}),
        });
        const savedUser = await repository.save(user);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            user: publicUser(savedUser),
        });
    } catch (error) {
        if (databaseErrorCode(error) === "ER_DUP_ENTRY") {
            res.status(409).json({ mensagem: "Este e-mail já está cadastrado!" });
            return;
        }

        res.status(500).json({ mensagem: "Erro ao cadastrar usuário!" });
    }
});

router.put("/users/:id", async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID de usuário inválido!" });
        return;
    }

    const { name, email, password, situationId } = req.body;
    if ((name !== undefined && (typeof name !== "string" || !name.trim())) ||
        (email !== undefined && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
        (password !== undefined && (typeof password !== "string" || !password.trim()))) {
        res.status(400).json({ mensagem: "Os dados informados para atualização são inválidos!" });
        return;
    }

    try {
        const repository = AppDataSource.getRepository(User);
        const user = await repository.findOneBy({ id });
        if (!user) {
            res.status(404).json({ mensagem: "Usuário não encontrado!" });
            return;
        }

        if (name !== undefined) user.name = name.trim();
        if (email !== undefined) user.email = email.trim().toLowerCase();
        if (password !== undefined) user.password = password;

        await repository.save(user);

        if (situationId !== undefined) {
            if (situationId === null) {
                await repository.createQueryBuilder().relation(User, "situation").of(id).set(null);
            } else {
                const situationIdNumber = Number(situationId);
                if (!Number.isInteger(situationIdNumber) || situationIdNumber < 1) {
                    res.status(400).json({ mensagem: "ID de situação inválido!" });
                    return;
                }

                const situationExists = await AppDataSource.getRepository(Situation).existsBy({ id: situationIdNumber });
                if (!situationExists) {
                    res.status(400).json({ mensagem: "A situação informada não existe!" });
                    return;
                }

                await repository.createQueryBuilder().relation(User, "situation").of(id).set(situationIdNumber);
            }
        }

        const updatedUser = await repository.findOne({
            where: { id },
            relations: { situation: true },
        });
        res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            user: updatedUser ? publicUser(updatedUser) : undefined,
        });
    } catch (error) {
        if (databaseErrorCode(error) === "ER_DUP_ENTRY") {
            res.status(409).json({ mensagem: "Este e-mail já está cadastrado!" });
            return;
        }

        res.status(500).json({ mensagem: "Erro ao atualizar usuário!" });
    }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID de usuário inválido!" });
        return;
    }

    try {
        const repository = AppDataSource.getRepository(User);
        const user = await repository.findOneBy({ id });
        if (!user) {
            res.status(404).json({ mensagem: "Usuário não encontrado!" });
            return;
        }

        await repository.remove(user);
        res.status(200).json({ mensagem: "Usuário removido com sucesso!" });
    } catch {
        res.status(500).json({ mensagem: "Erro ao remover usuário!" });
    }
});

export default router;