import { Router } from "express";
import { InscricaoController } from "../controllers/InscricaoController";


let router: Router = Router();  

let inscricaoController: InscricaoController = new InscricaoController();

router.post('/inscrição', inscricaoController.create);

router.get('/inscrição', inscricaoController.list);

router.put('/inscrição/:id', inscricaoController.update);

router.delete('/inscrição/:id', inscricaoController.delete);

// router.get("/inscriçãopdf", inscricaoController.downloadPdf);

// router.get("/inscriçãocsv", inscricaoController.exportCsv);

// router.post('/inscrição/login', inscricaoController.login);


export default router;