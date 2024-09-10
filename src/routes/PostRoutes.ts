import { Router } from "express";

import PostController from "../controllers/PostController";

const PostRouter = Router();


//Listar usuários
PostRouter.get("/posts", PostController.listPost);

//Inserir usuários
PostRouter.post("/post", PostController.createPost);

//Atualizar usuários
PostRouter.put("/post/:id", PostController.updatePost);

//Deletar usuários
PostRouter.delete("/post/:id", PostController.deletePost);

export default PostRouter;
