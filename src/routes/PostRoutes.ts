import { Router } from "express";
import PostController from "../controllers/PostController";

const PostRouter = Router();

PostRouter.get("/posts", PostController.listPosts);

PostRouter.post("/post", PostController.createPost);

PostRouter.put("/post/:id", PostController.updatePost);

PostRouter.delete("/post/:id", PostController.deletePost);

export default PostRouter;