import { Request, Response } from 'express';
import { Usuario } from '../models/Usuarios';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { Cliente } from '../models/Cliente';
import * as puppeteer from "puppeteer";

export class ClienteController {
    async list (req: Request, res: Response): Promise<Response> {
        let nome = req.query.nome;

        let cliente: Cliente[] = await Cliente.findBy({
          nome: nome ? ILike(`%${nome}%`) : undefined
        });

        return res.status(200).json(cliente);
      }

      async find (req: Request, res: Response): Promise<Response> {
        let cliente: Cliente = res.locals.cliente;

        return res.status(200).json(cliente);
      }

      async create (req: Request, res: Response): Promise<Response> {
        let body = req.body;


        let cliente: Cliente = await Cliente.create({
          nome: body.nome,
          endereco: body.endereco,
          email: body.email,
          telefone: body.telefone,
        }).save();


        return res.status(200).json(cliente);
      }

      async update (req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let cliente: Cliente = res.locals.cliente;


        cliente.nome = body.nome;
        cliente.endereco = body.endereco;
        cliente.email = body.email;
        cliente.telefone = body.telefone;
        await cliente.save();


        return res.status(200).json(cliente);
      }

      async delete (req: Request, res: Response): Promise<Response> {
        let cliente: Cliente = res.locals.cliente;

        cliente.remove();

        return res.status(200).json();
      }

      async downloadPdf(req: Request, res: Response) {
        let nome = req.query.nome;
        let html: string = `<style>
        *{
          font-family: "Arial";
        }
        table{
          width:100%;
          text-align: left;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        table td{
          padding: 10px
        }
        table th{
          padding: 10px
        }
        </style>
        <h1>Lista de clientes</h1>
      <table border="1">`;

        let clientes: Cliente[] = await Cliente.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });
        html += "<tr><th>ID</th> <th>Nome</th> <th>Endereço</th> <th>Email</th> <th>Telefone</th></tr>";
        clientes.forEach((element) => {
          html += `<tr><td>${element.id}</td> <td>${element.nome}</td> <td>${element.endereco}</td> <td>${element.email}</td> <td>${element.telefone}</td></tr>\r`;
        });
        html += "</table>";
        let today = new Date(Date.now());
        let data = today.toLocaleString(); // "30/1/2022"
        html += `<div>Gerado por: às ${data}</div>`;

        let pdfBuffer = await ClienteController.pdf(html);

        res.append("Content-Type", "application/x-pdf");
        res.append("Content-Disposition", 'attachment; filename="ListaClientes.pdf"');
        res.send(pdfBuffer);
      }

      static async pdf(html: string) {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.setContent(html);

        const pdfBuffer = await page.pdf();
        await page.close();
        await browser.close();

        return pdfBuffer;
      }

      async exportCsv(req: Request, res: Response): Promise<Response> {
        let nome = req.query.nome;

        let clientes: Cliente[] = await Cliente.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });

        let header = '"ID";"Nome";"Endereco";"E-Mail";"Telefone"\n';
        let csv = header;

        clientes.forEach((element) => {
          csv += `"${element.id}";"${element.nome}";"${element.endereco}";"${element.email}";"${element.telefone}"\r`;
        });

        res.append("Content-Type", "text/csv");
        res.attachment("ListaUsuarios.csv");
        return res.status(200).send(csv);
      }


}
