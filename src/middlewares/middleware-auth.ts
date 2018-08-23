import { NextFunction, Response } from "express";
import * as HttpStatus from "http-status";
import * as jwt from "jwt-simple";
import * as moment from "moment";
import { ICustomRequest } from "../interfaces/custom-request";
import { IError } from "./../interfaces/error";

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey";

export class MiddlewareAuth {

  public checkAuth(request: ICustomRequest, response: Response, next: NextFunction): void {
    const token = request.headers["x-access-token"];
    if (!token) {
      const err: IError = { message: "Acesso negado", status: HttpStatus.FORBIDDEN };
      return next(err);
    }
    try {
      const decoded = jwt.decode(token, secretJwtKey);
      const isExpired = moment(decoded.exp).isBefore(new Date());
      if (isExpired) {
        const err: IError = { message: "Não autorizado", status: HttpStatus.UNAUTHORIZED };
        return next(err);
      } else {
        request.decoded = decoded;
        next();
      }
    } catch (err) {
      return next(err);
    }
  }

}
