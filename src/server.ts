import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import admin from "./routes/admin";
import usuario from "./routes/usuario";
import cidade from "./routes/cidade";
import evento from "./routes/evento";
import inscricao from "./routes/inscricao";

let server: Express = express();

server.use(cors());
server.use(express.json());

server.use((req: Request, res: Response, next: NextFunction) => {
  console.log("[" + new Date() + "] " + req.method + " " + req.url);
  next();
});

server.use(admin);
server.use(usuario);
server.use(cidade);
server.use(evento);
server.use(inscricao);

export default {
  start() {
    server.listen(3000, () => {
      console.log("Server started!");
    });
  },
};
