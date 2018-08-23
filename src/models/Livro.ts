import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

import { Avaliacao } from "./Avaliacao";

@Table({
  timestamps: true,
})
export class Livro extends Model<Livro> {
  @PrimaryKey
  @Column
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING) public nome: string;

  @Column(DataType.STRING) public resumo: string;

  @Column(DataType.STRING) public autor: boolean;

  @Column(DataType.STRING) public ano: boolean;

  @HasMany(() => Avaliacao)
  public avaliacao: Avaliacao;
}
