import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Avaliacao } from "../../models/Avaliacao";
import { Livro } from "../../models/Livro";
import { Usuario } from "../../models/Usuario";
import { sequelize } from "../../sequelize";

export class LivroController {
  // tslint:disable-next-line:no-empty
  constructor() { }

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const livros: any[] = await Livro.findAll({
      attributes: ["nome", "resumo", "autor", "ano", "createdAt", "updatedAt", ["id", "LivroIdReferencia"],
        // tslint:disable-next-line:max-line-length
        [sequelize.literal("(SELECT COUNT(id) FROM Avaliacao WHERE Avaliacao.LivroId = LivroIdReferencia)"), "totalAvaliacoes"],
        // tslint:disable-next-line:max-line-length
        [sequelize.literal("(SELECT COUNT(id) FROM Avaliacao WHERE estadoConservacao = 'Ótimo' AND LivroId = LivroIdReferencia )"), "percentualOtimo"],
        // tslint:disable-next-line:max-line-length
        [sequelize.literal("(SELECT COUNT(id) FROM Avaliacao WHERE estadoConservacao = 'Bom' AND LivroId = LivroIdReferencia )"), "percentualBom"],
        // tslint:disable-next-line:max-line-length
        [sequelize.literal("(SELECT COUNT(id) FROM Avaliacao WHERE estadoConservacao = 'Ruim' AND LivroId = LivroIdReferencia )"), "percentualRuim"],
        // tslint:disable-next-line:max-line-length
        [sequelize.literal("(SELECT COUNT(id) FROM Avaliacao WHERE estadoConservacao = 'Regular' AND LivroId = LivroIdReferencia )"), "percentualRegular"],
        [sequelize.literal("(SELECT AVG(nota) FROM Avaliacao WHERE LivroId = LivroIdReferencia)"), "mediaNota"],
      ],
      include: [{
        include: [{
          model: Livro,
        }],
        model: Avaliacao,
      }],
    });
    response.json(livros);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Livro.findOne<Livro>({
      include: [{
        model: Avaliacao,
      }],
      where: { id: _id },
    })
      .then((livro) => {
        response.json(livro);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {

      const livro = Livro.build<Livro>({
        ano: request.body.ano,
        autor: request.body.autor,
        id: Uuid(),
        nome: request.body.nome,
        resumo: request.body.resumo,
      });

      livro.save()
        .then((novoLivro) => {
          response.json(novoLivro);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const livroUpdate = await Livro.findOne<Livro>({
        where: { id: _id },
      }) as Livro;

      if (request.body.nome) { livroUpdate.nome = request.body.nome; }
      if (request.body.resumo) { livroUpdate.resumo = request.body.resumo; }
      if (request.body.autor) { livroUpdate.autor = request.body.autor; }
      if (request.body.ano) { livroUpdate.ano = request.body.ano; }

      try {
        const livroAtualizado = await livroUpdate.save({ transaction: t });

        response.json(livroAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Livro.destroy({
      where: { id: request.params._id },
    })
      .then((livroRemovido) => {
        response.json(livroRemovido);
      })
      .catch((err) => {
        next(err);
      });
  }

}
