import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Livro } from "../../models/Livro";
import { Usuario } from "../../models/Usuario";
import { sequelize } from "../../sequelize";
import { Avaliacao } from "./../../models/Avaliacao";

export class UsuarioController {
  constructor() { }

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const usuarios: any[] = await Usuario.findAll({
      // tslint:disable-next-line:max-line-length
      attributes: ["id", "usuario", "createdAt", "updatedAt", ["id", "UsuarioReferencia"],
        [sequelize.literal("(SELECT AVG(nota) FROM Avaliacao WHERE UsuarioId = UsuarioReferencia)"), "mediaNota"],
      ],
      include: [{
        include: [{
          model: Livro,
        }],
        model: Avaliacao,
      }],
    });
    response.json(usuarios);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Usuario.findOne<Usuario>({
      attributes: ["id", "usuario", "createdAt"],
      where: { id: _id },
    })
      .then((usuario) => {
        response.json(usuario);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {

      const usuario = Usuario.build<Usuario>({
        id: Uuid(),
        senha: bcrypt.hashSync("12345", 10),
        usuario: request.body.usuario,
      },
      );

      usuario.save()
        .then((novoUsuario) => {
          response.json(novoUsuario);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const usuarioParaAtualizar = await Usuario.findOne<Usuario>({
        where: { id: _id },
      }) as Usuario;

      if (request.body.senha) { usuarioParaAtualizar.senha = bcrypt.hashSync(request.body.senha, 10); }
      if (request.body.usuario) { usuarioParaAtualizar.usuario = request.body.usuario; }

      try {
        const usuarioAtualizado = await usuarioParaAtualizar.save({ transaction: t });

        response.json(usuarioAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Usuario.destroy({
      where: { id: request.params._id },
    })
      .then((usuarioRemovido) => {
        response.json(usuarioRemovido);
      })
      .catch((err) => {
        next(err);
      });
  }

  public buscaUsuario(request: Request, response: Response, next: NextFunction): void {
    const _usuario = request.params._usuario;
    if (_usuario.length > 1) {
      Usuario.findAll({
        attributes: ["id", "usuario"],
        limit: 20,
        where: {
          usuario: _usuario,
        },
      })
        .then((usuarios: any) => {
          response.json(usuarios);
        })
        .catch((err: any) => {
          next(err);
        });
    } else {
      Usuario.findAll({
        attributes: ["id"],
        limit: 20,
        where: {
          usuario: _usuario,
        },
      })
        .then((usuarios: any) => {
          response.json(usuarios);
        })
        .catch((err: any) => {
          next(err);
        });
    }
  }
}
