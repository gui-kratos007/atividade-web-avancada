import express from "express";

import UserRouter from "./routes/UserRoutes";

const app = express();
app.use(express.json());

app.use(UserRouter);

app.listen(3000, function () {
  console.log("Servidor rodando na porta 3000");
});
