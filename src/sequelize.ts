import * as path from "path";
import { Sequelize } from "sequelize-typescript";

// tslint:disable-next-line:no-var-requires
const jsonConfig = require("./config/config.json");
const dbConfig = jsonConfig[process.env.NODE_ENV || "development"];
const urlModels = path.join(__dirname, "/models");

class Database {
  public sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      database: dbConfig.database,
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      modelPaths: [ urlModels ],
      password: dbConfig.password,
      username: dbConfig.username,
    });
  }

  public getSequelize() {
    return this.sequelize;
  }
}

export const database = new Database();
export const sequelize = database.getSequelize();
