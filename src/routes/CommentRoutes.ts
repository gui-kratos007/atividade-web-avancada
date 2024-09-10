import { Router } from "express";
import CommentController from "../controllers/CommentController";

const CommentRouter = Router();

CommentRouter.get("/comments", CommentController.listComments);

CommentRouter.post("/comment", CommentController.createComment);

CommentRouter.put("/comment/:id", CommentController.updateComment);

CommentRouter.delete("/comment/:id", CommentController.deleteComment);

export default CommentRouter;
