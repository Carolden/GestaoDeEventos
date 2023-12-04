import { NextFunction, Request, Response, Router } from "express";
import { InscricaoController } from "../controllers/InscricaoController";
import { Inscricao } from "../models/Inscricao";

let router: Router = Router();

let inscricaoController: InscricaoController = new InscricaoController();

async function validarSeExiste(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  let id = Number(req.params.id);

  let inscricao: Inscricao | null = await Inscricao.findOneBy({ id });
  if (!inscricao) {
    return res.status(422).json({ error: "Inscrição não encontrada!" });
  }

  res.locals.inscricao = inscricao;

  return next();
}

router.post("/inscricao", inscricaoController.create);

router.get("/inscricao", inscricaoController.list);

router.get("/inscricao/:id", validarSeExiste, inscricaoController.find);

router.put("/inscricao/:id", validarSeExiste, inscricaoController.update);

router.delete("/inscricao/:id", validarSeExiste, inscricaoController.delete);

router.post("/usuarioemail", inscricaoController.sendEmail);

// router.get("/inscricaopdf", inscricaoController.downloadPdf);

// router.get("/inscricaocsv", inscricaoController.exportCsv);

// router.post('/inscricao/login', inscricaoController.login);

export default router;
