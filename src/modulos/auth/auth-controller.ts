import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as HttpStatus from "http-status";
import { ICustomRequest } from "../../interfaces/custom-request";
import { IError } from "../../interfaces/error";
import { HelperAuth } from "../../modulos/auth/helper-auth";
import { Usuario } from "./../../models/Usuario";

const helperAuth = new HelperAuth();

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey";
export class AutenticarController {

  // tslint:disable-next-line:no-empty
  constructor() {

  }

  public token(request: Request, response: Response, next: NextFunction): void {
    const usuario = request.body.usuario;
    const senha = request.body.senha;

    if (!usuario || !senha) {
      const err: IError = { message: "Faltando usuário ou senha", status: HttpStatus.BAD_REQUEST };
      return next(err);
    } else {
      Usuario.findOne<Usuario>({
        attributes: ["id", "usuario", "senha"],
        where: {
          usuario,
        },
      })
      .then(async (usuarioRetornado: any) => {
        console.log("teste->");
        console.log("teste->");
        console.log("teste->");
        if (usuarioRetornado) {

          if (bcrypt.compareSync(senha, usuarioRetornado.senha)) {
            const token = helperAuth.generateToken(usuarioRetornado);

            const data: any = {
              UsuarioId: usuarioRetornado.id,
              usuario: usuarioRetornado.usuario,
            };

            response.json({
              data,
              token,
            });

          } else {
            const err: IError = { message: "Usuário ou senha incorretos", status: 403 };
            return next(err);
          }
        } else {
          response.json("Usuário ou senha inválidos");
        }
      })
      .catch((error: any) => {
        // tslint:disable-next-line:no-console
        console.log(error);
        next(error);
      });
    }
  }

  public refreshToken(request: ICustomRequest, response: Response, next: NextFunction): void {
    const idUsuarioLogado = request.decoded.id;
    if (!idUsuarioLogado) {
      const err: IError = { message: "Não foi possível identificar o usuário", status: HttpStatus.BAD_REQUEST };
      return next(err);
    } else {
      Usuario.findOne<Usuario>({
        attributes: ["id", "usuario", "senha"],
        where: { id: idUsuarioLogado },
      })
      .then((usuarioRetornado: any) => {
        const token = helperAuth.generateToken(usuarioRetornado);
        response.json({
          data: {
            usuario: usuarioRetornado.usuario,
          },
          token,
        });
      })
      .catch((error) => {
        next(error);
      });
    }
  }
}
