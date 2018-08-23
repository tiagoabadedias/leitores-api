import * as jwt from "jwt-simple";
import * as moment from "moment";

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey";

export class HelperAuth {

  public generateToken = (user: any): string => {
    const expires = moment().add(1, "days").valueOf();

    const token = jwt.encode({
      exp: expires,
      id: user.id,
      usuario: user,
    }, secretJwtKey);
    return token;
  }

  public decodedToken = (token: any): string => {
    return jwt.decode(token, secretJwtKey);
  }

}
