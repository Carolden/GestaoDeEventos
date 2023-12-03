import { Router } from "express";
import { InscricaoController } from "../controllers/InscricaoController";

let router: Router = Router();

let inscricaoController: InscricaoController = new InscricaoController();

router.post("/inscricao", inscricaoController.create);

router.get("/inscricao", inscricaoController.list);

router.put("/inscricao/:id", inscricaoController.update);

router.delete("/inscricao/:id", inscricaoController.delete);

router.post("/usuarioemail", inscricaoController.sendEmail);

// router.get("/inscricaopdf", inscricaoController.downloadPdf);

// router.get("/inscricaocsv", inscricaoController.exportCsv);

// router.post('/inscricao/login', inscricaoController.login);

export default router;
