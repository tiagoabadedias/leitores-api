import * as http from "http";
import app from "./app";

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey";
const port = normalizePort(process.env.PORT || 3000);
const server = http.createServer(app);


server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: number | string): number | string | boolean {
  // tslint:disable-next-line:no-shadowed-variable
  const port: number = typeof val == "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else { 
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") { throw error; }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line:no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      // tslint:disable-next-line:no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr == "string" ? `pipe ${addr}` : `port ${addr.port}`;
  // tslint:disable-next-line:no-console
  console.info(`Listening on ${bind}`);
}
