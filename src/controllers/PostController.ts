import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostController {
  async listPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await prisma.post.findMany();
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao listar posts',
      });
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;

      if (!postData.title || !postData.content) {
        res.status(400).json({
          status: 400,
          message: "Você precisa passar o título e o conteúdo no corpo da requisição",
        });
        return;
      }

      const newPost = await prisma.post.create({
        data: postData,
      });

      res.status(201).json({
        status: 201,
        newPost: newPost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Erro ao criar o post",
      });
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const body = req.body;

      const updatedPost = await prisma.post.update({
        where: {
          id: parseInt(id),
        },
        data: body,
      });

      if (updatedPost) {
        res.json({
          status: 200,
          updatedPost: updatedPost,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Post não encontrado",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Erro ao atualizar o post",
      });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      await prisma.post.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: 200,
        message: "Post deletado com sucesso",
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: "Erro ao deletar o post",
      });
    }
  }
}

export default new PostController();
