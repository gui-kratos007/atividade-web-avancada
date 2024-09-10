import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AiConversation from '../utils/AiAnalisys';

const prisma = new PrismaClient();

class CommentController {
    constructor() {}

    async listComment(req: Request, res: Response) {
        try {
            const comments = await prisma.comment.findMany();
            res.json(comments);
        } catch (error) {
            console.error("Erro ao listar os comentários: ", error);
            return res.status(500).json({
                error: "Erro interno ao buscar os comentários."
            });
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const { title, authorId, content } = req.body;

            if (!title) {
                return res.status(400).json({
                    status: 400,
                    message: "O campo título é obrigatório.",
                });
            }

            if (!authorId) {
                return res.status(400).json({
                    status: 400,
                    message: "O campo authorId é obrigatório.",
                });
            }

            const response = await AiConversation(content);
            const evaluation = JSON.parse(response);

            const newComment = await prisma.comment.create({
                data: {
                    title,
                    content,
                    authorId,
                    evaluation: evaluation.classificação,
                }
            });

            res.status(201).json({
                status: 201,
                newComment,
            });

        } catch (error) {
            console.error("Erro ao criar o comentário: ", error);
            res.status(500).json({
                status: 500,
                message: "Erro interno ao tentar criar o comentário.",
            });
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedComment = await prisma.comment.update({
                where: {
                    id: parseInt(id),
                },
                data: updatedData,
            });

            res.json({
                status: 200,
                updatedComment,
            });

        } catch (error) {
            console.error("Erro ao atualizar o comentário: ", error);
            res.status(500).json({
                status: 500,
                message: "Erro interno ao atualizar o comentário.",
            });
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await prisma.comment.delete({
                where: {
                    id: parseInt(id),
                },
            });

            res.status(200).json({
                status: 200,
                message: "Comentário deletado com sucesso.",
            });

        } catch (error) {
            console.error("Erro ao deletar o comentário: ", error);
            res.status(400).json({
                message: "Erro ao tentar deletar o comentário.",
            });
        }
    }
}

export default new CommentController();
