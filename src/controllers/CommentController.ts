import { Request, Response } from "express";
import axios from "axios";

const GROQ_API_URL = "https://api.groq.ai/classify";
const GROQ_API_KEY = "your_groq_api_key";

const comments: Array<{ id: number, text: string, postId: number, userId: number, classification: string }> = [];
let nextId = 1;

class CommentController {
  public async listComments(req: Request, res: Response): Promise<void> {
    try {
      const { postId, userId } = req.query;
      let filteredComments = comments;

      if (postId) {
        filteredComments = filteredComments.filter(comment => comment.postId === parseInt(postId as string, 10));
      }

      if (userId) {
        filteredComments = filteredComments.filter(comment => comment.userId === parseInt(userId as string, 10));
      }

      res.status(200).json({ comments: filteredComments });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar comentários' });
    }
  }

  private async classifyComment(text: string): Promise<string> {
    try {
      const response = await axios.post(GROQ_API_URL, {
        text: text
      }, {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const classification = response.data.classification;
      return classification === 'offensive' ? 'ofensivo' : 'não ofensivo';
    } catch (error) {
      console.error('Erro ao classificar comentário:', error);
      return 'não ofensivo';
    }
  }

  public async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { text, postId, userId } = req.body;

      const classification = await this.classifyComment(text);

      const newComment = { id: nextId++, text, postId, userId, classification };
      comments.push(newComment);

      res.status(201).json({ message: 'Comentário criado', comment: newComment });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Erro ao criar comentário' });
      } else {
        res.status(500).json({ error: 'Erro inesperado ao criar comentário' });
      }
    }
  }

  public async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const commentId = parseInt(id, 10); 

      const classification = await this.classifyComment(text);

      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      if (commentIndex === -1) {
        res.status(404).json({ error: 'Comentário não encontrado' });
        return;
      }

      comments[commentIndex].text = text;
      comments[commentIndex].classification = classification;

      res.status(200).json({ message: 'Comentário atualizado', comment: comments[commentIndex] });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
  }

  public async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commentId = parseInt(id, 10);

      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      if (commentIndex === -1) {
        res.status(404).json({ error: 'Comentário não encontrado' });
        return;
      }

      comments.splice(commentIndex, 1);

      res.status(200).json({ message: 'Comentário deletado' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
  }
}

export default new CommentController();
