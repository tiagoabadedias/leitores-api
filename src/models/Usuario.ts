import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

import { Avaliacao } from "./Avaliacao";

@Table({
  timestamps: true,
})
export class Usuario extends Model<Usuario> {
  @PrimaryKey
  @Column
  public id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING) public usuario: string;

  @AllowNull(false)
  @Column(DataType.STRING) public senha: string;

  @HasMany(() => Avaliacao)
  public avaliacao: Avaliacao;

}
