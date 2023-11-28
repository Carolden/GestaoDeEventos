import { Request, Response } from 'express';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin';
import * as puppeteer from "puppeteer";

export class AdminController {
    async list (req: Request, res: Response): Promise<Response> {
        let nome = req.query.nome;

        let admin: Admin[] = await Admin.findBy({
          nome: nome ? ILike(`%${nome}%`) : undefined
        });

        return res.status(200).json(admin);
      }

      async find (req: Request, res: Response): Promise<Response> {
        let admin: Admin = res.locals.cliente;

        return res.status(200).json(admin);
      }

      async create (req: Request, res: Response): Promise<Response> {
        let body = req.body;


        let admin: Admin = await Admin.create({
          nome: body.nome,
          email: body.email,
          senha: body.senha,
          role: body.role,
        }).save();


        return res.status(200).json(admin);
      }

      async update (req: Request, res: Response): Promise<Response> {
        try {
          console.log('Administrador encontrado:', res.locals.admin);
      
          const body = req.body;
          const adminId = Number(req.params.id);
      
          // Substitua 'Admin' pelo nome real do seu modelo de administrador
          const admin = await Admin.findOneBy({ id: adminId });
      
          if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
          }
      
          admin.nome = body.nome;
          admin.email = body.email;
          admin.senha = body.senha;
          admin.role = body.role;
      
          await admin.save();
      
          return res.status(200).json(admin);
        } catch (error) {
          console.error('Erro ao atualizar administrador:', error);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
      }

      async delete (req: Request, res: Response): Promise<Response> {
        try {
          const adminId = Number(req.params.id);
      
          // Substitua 'Admin' pelo nome real do seu modelo de administrador
          const admin = await Admin.findOneBy({ id: adminId });
      
          if (!admin) {
            return res.status(404).json({ message: 'Administrador não encontrado.' });
          }
      
          await admin.remove();
      
          return res.status(204).send();
        } catch (error) {
          console.error('Erro ao excluir administrador', error);
          return res.status(500).json({ message: 'Erro ao excluir administrador' });
        }
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
        <h1>Lista de Admins</h1>
      <table border="1">`;

        let admin: Admin[] = await Admin.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });
        html += "<tr><th>ID</th> <th>Nome</th> <th>Endereço</th> <th>Email</th> <th>Telefone</th></tr>";
        admin.forEach((element) => {
          html += `<tr><td>${element.id}</td> <td>${element.nome}</td> <td>${element.email}</td> \r`;
        });
        html += "</table>";
        let today = new Date(Date.now());
        let data = today.toLocaleString(); // "30/1/2022"
        html += `<div>Gerado por: às ${data}</div>`;

        let pdfBuffer = await AdminController.pdf(html);

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

        let admin: Admin[] = await Admin.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });

        let header = '"ID";"Nome";"E-mail"\n';
        let csv = header;

        admin.forEach((element) => {
          csv += `"${element.id}";"${element.nome}";"${element.email}"\r`;
        });

        res.append("Content-Type", "text/csv");
        res.attachment("ListaUsuarios.csv");
        return res.status(200).send(csv);
      }


}
