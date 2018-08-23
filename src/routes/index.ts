import * as express from "express";
import { MiddlewareAuth } from "../middlewares/middleware-auth";
import { AutenticarController } from "../modulos/auth/auth-controller";
import livroAvaliacaoRotas from "../modulos/livro-avaliacao/livro-avaliacao-rotas";
import livroRotas from "../modulos/livro/livro-rotas";
import usuarioRotas from "./../modulos/usuario/usuario-rotas";

class Routes {
  public express: express.Application;
  public router: express.Router;
  public autenticarController: AutenticarController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.autenticarController = new AutenticarController();
    this.middlewareAuth = new MiddlewareAuth();
    this.routes();
  }

  private routes(): void {
    // Rotas de autenticação
    this.router.post("/token", this.autenticarController.token);
    // Rotas dos módulos
    this.router.use("/usuario", usuarioRotas);
    this.router.use("/livro", livroRotas);
    this.router.use("/livro-avaliacao", livroAvaliacaoRotas);
  }
}

export default new Routes().router;
