import { NextFunction, Request, Response, Router } from 'express';
import { Cidade } from '../models/Cidade';
import { CidadeController } from '../controllers/CidadeController';
import * as yup from 'yup';


async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  let schema = yup.object({
    nome: yup.string().min(3).max(255).required(),
  })

  let payload = req.body;

  try {
    let resultado = await schema.validate(payload, { abortEarly: false, stripUnknown: true });
    return next();
  } catch (error) {
    if (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ error: 'Ops! Algo deu errado!' });
    }

  }
}

async function validarSeExiste(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  let id = Number(req.params.id);

  let cidade: Cidade | null = await Cidade.findOneBy({ id });
  if (!cidade) {
    return res.status(422).json({ error: 'Cidade não encontrada!' });
  }

  res.locals.cidade = cidade;

  return next();
}


let router: Router = Router();

let cidadeController: CidadeController = new CidadeController();

router.get('/cidade', cidadeController.list);

router.get('/cidade/:id', validarPayload, validarSeExiste, cidadeController.find);

router.post('/cidade', validarPayload, cidadeController.create);

router.put('/cidade/:id', validarPayload, validarSeExiste, cidadeController.update);

router.delete('/cidade/:id', validarSeExiste, cidadeController.delete);

export default router;