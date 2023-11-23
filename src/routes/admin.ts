import { NextFunction, Request, Response, Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import * as yup from 'yup';
import { Usuario } from '../models/Usuarios';
import { Not } from 'typeorm';
import { Cliente } from '../models/Cliente';

async function validarPayload (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
    let schema = yup.object({
      nome: yup.string().min(3).max(255).required(),
      endereco: yup.string().required(),
      email: yup.string().email().required(),
      telefone: yup.string().required()
    });

    let payload = req.body;

    try {
      req.body = await schema.validate(payload, { abortEarly: false, stripUnknown: true });

      return next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ error: 'Ops! Algo deu errado.' });
    }
  }

async function validarSeEmailExiste (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
    let email: string = req.body.email;
    let id: number|undefined = req.params.id ? Number(req.params.id) : undefined;

    let cliente: Cliente|null = await Cliente.findOneBy({ email, id: id ? Not(id) : undefined });
    if (cliente) {
      return res.status(422).json({ error: 'Email já cadastrado!' });
    }

    return next();
  }

async function validarSeExiste (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
    let id = Number(req.params.id);
    let cliente: Cliente|null = await Cliente.findOneBy({ id });
    if (! cliente) {
      return res.status(422).json({ error: 'Usuario não encontrado!' });
    }

    res.locals.cliente = cliente;

    return next();
  }

let router: Router = Router();

let clienteController: ClienteController = new ClienteController();

router.post('/cliente', validarPayload, validarSeEmailExiste, clienteController.create);

router.get('/cliente/:id', validarSeExiste, clienteController.find);

router.get('/cliente', clienteController.list);

router.put('/cliente/:id', validarSeExiste, validarPayload, validarSeEmailExiste, clienteController.update);

router.delete('/cliente/:id', validarSeExiste, clienteController.delete);

router.get("/clientePDF", clienteController.downloadPdf);

router.get("/clienteCSV", clienteController.exportCsv);

export default router;
