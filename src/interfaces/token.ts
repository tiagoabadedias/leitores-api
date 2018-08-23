import { Usuario } from "./../models/Usuario";

export interface IToken {
  token?: string;
  data?: Usuario;
}
