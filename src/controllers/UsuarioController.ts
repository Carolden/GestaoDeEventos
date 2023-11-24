import { Request, Response } from 'express';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin';
import * as puppeteer from "puppeteer";
import { Usuario } from '../models/Usuario';

export class UsuarioController {
    async list (req: Request, res: Response): Promise<Response> {
        let nome = req.query.nome;

        let usuario: Usuario[] = await Usuario.findBy({
          nome: nome ? ILike(`%${nome}%`) : undefined
        });

        return res.status(200).json(usuario);
      }

      async find (req: Request, res: Response): Promise<Response> {
        let usuario: Usuario = res.locals.usuario;

        return res.status(200).json(usuario);
      }

      async create (req: Request, res: Response): Promise<Response> {
        let body = req.body;


        let usuario: Usuario = await Usuario.create({
          nome: body.nome,
          email: body.email,
          senha: body.senha,
          role: body.role,
        }).save();


        return res.status(200).json(usuario);
      }

      async update (req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let usuario: Usuario = res.locals.usuario;


        usuario.nome = body.nome;
        usuario.email = body.email;
        usuario.senha = body.senha;
        usuario.role = body.role;
        await usuario.save();


        return res.status(200).json(usuario);
      }

      async delete (req: Request, res: Response): Promise<Response> {
        let usuario: Admin = res.locals.usuario;

        usuario.remove();

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
        <h1>Lista de Admins</h1>
      <table border="1">`;

        let usuario: Usuario[] = await Usuario.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });
        html += "<tr><th>ID</th> <th>Nome</th> <th>Endereço</th> <th>Email</th> <th>Telefone</th></tr>";
        usuario.forEach((element) => {
          html += `<tr><td>${element.id}</td> <td>${element.nome}</td> <td>${element.email}</td> <td>${element.cpf}</td> <td>${element.telefone}</td> <td>${element.endereco}</td>\r`;
        });
        html += "</table>";
        let today = new Date(Date.now());
        let data = today.toLocaleString(); // "30/1/2022"
        html += `<div>Gerado por: às ${data}</div>`;

        let pdfBuffer = await UsuarioController.pdf(html);

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

        let usuario: Usuario[] = await Usuario.findBy({
          nome: nome ? ILike(`${nome}`) : undefined,
        });

        let header = '"ID";"Nome";"E-mail"\n';
        let csv = header;

        usuario.forEach((element) => {
          csv += `"${element.id}";"${element.nome}";"${element.email}";"${element.cpf}";"${element.telefone}";"${element.endereco}"\r`;
        });

        res.append("Content-Type", "text/csv");
        res.attachment("ListaUsuarios.csv");
        return res.status(200).send(csv);
      }

      async login (req: Request, res: Response): Promise<Response> {
        let body = req.body;
        // let senha = md5(body.senha);
        let usuarioLogin = await Usuario.findOneBy({email: body.email, senha: body.senha});
        let adminLogin = await Admin.findOneBy({email: body.email, senha: body.senha});

        if (adminLogin) {
          return res.status(200).json();
        }

        if (usuarioLogin) {
            return res.status(200).json();
        }

        return res.status(422).json({
            mensagem: "Usuário ou senha incorretos"
        });
    }


}
