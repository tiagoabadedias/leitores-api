import * as express from "express";
import { UsuarioController } from "../usuario/usuario-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class UsuarioRotas {
  public express: express.Application;
  public router: express.Router;
  public usuarioController: UsuarioController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.usuarioController = new UsuarioController();
    this.middlewareAuth = new MiddlewareAuth();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/", this.middlewareAuth.checkAuth, this.usuarioController.getAll);
    this.router.get("/:_id", this.middlewareAuth.checkAuth, this.usuarioController.getOne);
    this.router.get("/buscar/:_usuario", this.usuarioController.buscaUsuario);
    this.router.post("/", this.middlewareAuth.checkAuth, this.usuarioController.create);
    this.router.put("/:_id", this.middlewareAuth.checkAuth, this.usuarioController.update);
    this.router.delete("/:_id", this.middlewareAuth.checkAuth, this.usuarioController.delete);
  }
}

export default new UsuarioRotas().router;
