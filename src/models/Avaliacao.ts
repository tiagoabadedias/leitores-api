import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Livro } from "./Livro";
import { Usuario } from "./Usuario";

@Table({
  timestamps: true,
})
export class Avaliacao extends Model<Avaliacao> {
  @PrimaryKey
  @Column
  public id: string;

  @AllowNull(false)
  @ForeignKey(() => Usuario)
  @Column
  public UsuarioId: string;

  @AllowNull(false)
  @ForeignKey(() => Livro)
  @Column
  public LivroId: string;

  @AllowNull(false)
  @Column(DataType.STRING) public estadoConservacao: string;

  @Column(DataType.NUMERIC) public nota: number;

  @Column(DataType.STRING) public observacao: string;

  @BelongsTo(() => Usuario)
  public usuario: Usuario;

  @BelongsTo(() => Livro)
  public livro: Livro;

}
