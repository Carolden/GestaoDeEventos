import { NextFunction, Request, Response, Router } from "express";
import * as yup from "yup";
import { Evento } from "../models/Evento";
import { EventoController } from "../controllers/EventoController";
import parse from "date-fns/parse";

async function validarPayload(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  let schema = yup.object({
    descricao: yup.string().min(3).max(255).required(),
    dataInicio: yup
      .date()
      .transform((value, originalValue) =>
        parse(originalValue, "dd/MM/yyyy", new Date())
      ),
    dataFim: yup
      .date()
      .transform((value, originalValue) =>
        parse(originalValue, "dd/MM/yyyy", new Date())
      ),
    horaInicio: yup.string().min(1).max(5).required(),
    horaFim: yup.string().min(1).max(5).required(),
    local: yup.string().min(3).max(45).required(),
    id_cidade: yup.number().required(),
    id_admin: yup.number().required(),
  });

  let payload = req.body;

  try {
    let resultado = await schema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
    return next();
  } catch (error) {
    if (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ error: "Ops! Algo deu errado!" });
    }
  }
}

async function validarSeExiste(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  let id = Number(req.params.id);

  let evento: Evento | null = await Evento.findOneBy({ id });
  if (!evento) {
    return res.status(422).json({ error: "Evento não encontrado!" });
  }

  res.locals.evento = evento;

  return next();
}

let router: Router = Router();

let eventoController: EventoController = new EventoController();

router.get("/evento", eventoController.list);

router.get("/evento/:id", validarSeExiste, eventoController.find);

router.post("/evento", validarPayload, eventoController.create);

router.put(
  "/evento/:id",
  validarPayload,
  validarSeExiste,
  eventoController.update
);

router.delete("/evento/:id", validarSeExiste, eventoController.delete);

router.get("/eventoPdf", eventoController.pdf);

router.get("/eventoCsv", eventoController.listCsv);

export default router;
