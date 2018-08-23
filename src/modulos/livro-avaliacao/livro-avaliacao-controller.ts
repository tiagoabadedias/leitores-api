import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Avaliacao } from "../../models/Avaliacao";
import { Livro } from "../../models/Livro";
import { Usuario } from "../../models/Usuario";
import { sequelize } from "../../sequelize";

export class LivroAvaliacaoController {
  // tslint:disable-next-line:no-empty
  constructor() { }

  public async getAll(request: ICustomRequest, response: Response, next: NextFunction) {

    let offset = 0;
    let filters = request.query;
    let filter: any = {};
    let filterCountPage: any = {};

    let where = {
      $or: [
        {
          observacao: {
            $like: `%${filters.search}%`,
          },
        },
        {
          "$livro.nome$": {
            $like: `%${filters.search}%`,
          },
        },
        {
          estadoConservacao: {
            $like: `%${filters.search}%`,
          },
        }],
    };

    let include = [{
      model: Livro,
    },
    {
      model: Usuario,
    }];

    if (filters.search) {

      filterCountPage.include = include;
      filterCountPage.where = where;
    }

    Avaliacao.findAndCountAll(filterCountPage)
      .then((data) => {
        const pages = Math.ceil(data.count / filters.limit);
        offset = filters.limit * (filters.page - 1);

        filter.include = include;

        filter.attributes = ["id", "UsuarioId", "nota", "LivroId", "estadoConservacao", "observacao"];

        if (filters.limit) {
          filter.limit = Number(filters.limit);
        }

        filter.offset = offset;

        if (filters.order) {
          if (filters.property === "livro") {
            filter.order = [[filters.property, "nome", filters.order]];
          } else {
            filter.order = [[filters.property, filters.order]];
          }
        }

        if (filters.search) {
          filter.where = where;
        }
        Avaliacao.findAll(filter)
          .then((avaliacoes) => {
            response.status(200).json({ avaliacao: avaliacoes, count: data.count, pages });
          });
      }).catch(function (error) {
        response.status(500).send("Internal Server Error");
      });

  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Avaliacao.findOne<Avaliacao>({
      where: { id: _id },
    })
      .then((avaliacao) => {
        response.json(avaliacao);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {

      const existeAvaliacao = await Avaliacao.findOne<Avaliacao>({
        where: { UsuarioId: request.body.UsuarioId, LivroId: request.body.LivroId },
      }) as Avaliacao;

      if (!existeAvaliacao) {

        const avaliacao = Avaliacao.build<Avaliacao>({
          LivroId: request.body.LivroId,
          UsuarioId: request.body.UsuarioId,
          estadoConservacao: request.body.estadoConservacao,
          id: Uuid(),
          nota: request.body.nota,
          observacao: request.body.observacao,
        });

        avaliacao.save()
          .then((novaAvaliacao) => {
            response.json(novaAvaliacao);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        response.json("Já existe uma avaliação sua para este livro. Selecione outro livro para efetuar a avaliação.");
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Avaliacao.destroy({
      where: { id: request.params._id },
    })
      .then((avaliacaoRemovida) => {
        response.json(avaliacaoRemovida);
      })
      .catch((err) => {
        next(err);
      });
  }
}
