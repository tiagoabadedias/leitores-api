import * as express from "express";
import { LivroAvaliacaoController } from "../livro-avaliacao/livro-avaliacao-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class LivroRotas {
  public express: express.Application;
  public router: express.Router;
  public livroAvaliacaoController: LivroAvaliacaoController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.livroAvaliacaoController = new LivroAvaliacaoController();
    this.middlewareAuth = new MiddlewareAuth();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/", this.livroAvaliacaoController.getAll);
    this.router.get("/:_id", this.livroAvaliacaoController.getOne);
    this.router.post("/", this.livroAvaliacaoController.create);
    this.router.delete("/:_id", this.livroAvaliacaoController.delete);
  }
}

export default new LivroRotas().router;
