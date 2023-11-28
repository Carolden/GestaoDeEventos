import { NextFunction, Request, Response, Router } from "express";
import * as yup from "yup";
import { Usuario } from "../models/Usuario";
import { Not } from "typeorm";
import { AdminController } from "../controllers/AdminController";
import { UsuarioController } from "../controllers/UsuarioController";

// async function validarPayload (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
//     let schema = yup.object({
//       nome: yup.string().min(3).max(255).required(),
//       endereco: yup.string().required(),
//       email: yup.string().email().required(),
//       telefone: yup.string().required()
//     });

//     let payload = req.body;

//     try {
//       req.body = await schema.validate(payload, { abortEarly: false, stripUnknown: true });

//       return next();
//     } catch (error) {
//       if (error instanceof yup.ValidationError) {
//         return res.status(400).json({ errors: error.errors });
//       }
//       return res.status(500).json({ error: 'Ops! Algo deu errado.' });
//     }
//   }

// async function validarSeEmailExiste (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
//     let email: string = req.body.email;
//     let id: number|undefined = req.params.id ? Number(req.params.id) : undefined;

//     let cliente: Cliente|null = await Cliente.findOneBy({ email, id: id ? Not(id) : undefined });
//     if (cliente) {
//       return res.status(422).json({ error: 'Email já cadastrado!' });
//     }

//     return next();
//   }

async function validarSeExiste(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  let id = Number(req.params.id);
  let usuario: Usuario | null = await Usuario.findOneBy({ id });
  if (!usuario) {
    return res.status(422).json({ error: "Usuario não encontrado!" });
  }

  res.locals.usuario = usuario;

  return next();
}

let router: Router = Router();

let usuarioController: UsuarioController = new UsuarioController();

router.post("/usuario", usuarioController.create);

router.get("/usuario/:id", validarSeExiste, usuarioController.find);

router.get("/usuario", usuarioController.list);

router.put("/usuario/:id", usuarioController.update);

router.delete("/usuario/:id", usuarioController.delete);

router.get("/usuariopdf", usuarioController.downloadPdf);

router.get("/usuariocsv", usuarioController.exportCsv);

router.post("/usuario/login", usuarioController.login);

export default router;
