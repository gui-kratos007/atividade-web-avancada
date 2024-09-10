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
        } catch (err) {
            console.error("Erro ao obter os comentários: ", err);
            res.status(500).json({
                error: "Não foi possível carregar os comentários no momento."
            });
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const { title, authorId, content } = req.body;

            if (!title) {
                return res.status(400).json({
                    status: 400,
                    message: "O título é obrigatório.",
                });
            }

            if (!authorId) {
                return res.status(400).json({
                    status: 400,
                    message: "O ID do autor é necessário.",
                });
            }

            const aiResponse = await AiConversation(content);
            const evaluation = JSON.parse(aiResponse);

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
        } catch (err) {
            console.error("Erro ao tentar criar o comentário: ", err);
            res.status(500).json({
                status: 500,
                message: "Erro ao criar o comentário, tente novamente mais tarde.",
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
        } catch (err) {
            console.error("Erro ao atualizar o comentário: ", err);
            res.status(500).json({
                status: 500,
                message: "Não foi possível atualizar o comentário.",
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
                message: "Comentário removido com sucesso.",
            });
        } catch (err) {
            console.error("Erro ao remover o comentário: ", err);
            res.status(400).json({
                message: "Erro ao deletar o comentário.",
            });
        }
    }
}

export default new CommentController();

}

export default new PostController();
