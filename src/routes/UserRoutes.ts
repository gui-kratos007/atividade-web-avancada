import { Router } from "express";

import UserController from "../controllers/UserController";

const UserRouter = Router();


//Listar usuários
UserRouter.get("/users", UserController.listUser);

//Inserir usuários
UserRouter.post("/user", UserController.createUser);

//Atualizar usuários
UserRouter.put("/user/:id", UserController.updateUser);

//Deletar usuários
UserRouter.delete("/user/:id", UserController.deleteUser);

export default UserRouter;