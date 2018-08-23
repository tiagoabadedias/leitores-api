import * as express from "express";
import { LivroController } from "../livro/livro-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class LivroRotas {
  public express: express.Application;
  public router: express.Router;
  public livroController: LivroController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.livroController = new LivroController();
    this.middlewareAuth = new MiddlewareAuth();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/", this.livroController.getAll);
    this.router.get("/:_id", this.livroController.getOne);
    this.router.post("/", this.middlewareAuth.checkAuth, this.livroController.create);
    this.router.put("/:_id", this.middlewareAuth.checkAuth, this.livroController.update);
    this.router.delete("/:_id", this.middlewareAuth.checkAuth, this.livroController.delete);
  }
}

export default new LivroRotas().router;
