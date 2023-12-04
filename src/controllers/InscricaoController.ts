import { Inscricao } from "../models/Inscricao";
import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import puppeteer from "puppeteer";
import * as nodemailer from "nodemailer";

export class InscricaoController {
  async sendEmail(req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let emailConfig = {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    };

    let mailOptions = {
      from: "rellirenan@outlook.com",
      to: body.email,
      subject: "Eventos Crie_TI",
      html: `Olá ${body.nome}, a sua inscrição no evento ${body.evento} está confirmada!`,
    };

    let transporter = nodemailer.createTransport(emailConfig);

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log("Erro ao enviar email:" + error);
        return res.status(401).send("Erro ao enviar email" + error);
      } else {
        console.log("Email enviado: " + info.response);
        return res.status(200).send("Email enviado: " + info.response);
      }
    });

    return res.status(401);
  }

  async list(req: Request, res: Response): Promise<Response> {
    let event: Inscricao[] = await Inscricao.find();

    return res.status(200).json(event);
  }

  async find(req: Request, res: Response): Promise<Response> {
    let Inscricao: Inscricao = res.locals.inscricao;

    return res.status(200).json(Inscricao);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      let body = req.body;

      let inscricao: Inscricao = await Inscricao.create({
        id_evento: body.id_evento,
        id_usuario: body.id_usuario,
        status: body.status,
      }).save();

      return res.status(200).json(inscricao);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    let body = req.body;
    let inscricao: Inscricao = res.locals.inscricao;

    (inscricao.id = body.id),
      (inscricao.id_evento = body.id_evento),
      (inscricao.id_usuario = body.id_usuario),
      (inscricao.status = body.status);
    await inscricao.save();

    return res.status(200).json(inscricao);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    let inscricao: Inscricao = res.locals.inscricao;

    inscricao.remove();

    return res.status(200).json();
  }

  // async pdf(req: Request, res: Response) {
  //     let dados = await Inscricao.find();
  //     console.log(dados);

  //     let html: string = `<style>
  //     *{
  //       font-family: "Arial";
  //     }
  //     table{
  //       width:100%;
  //       text-align: left;
  //       border-collapse: collapse;
  //       margin-bottom: 10px;
  //     }
  //     table td{
  //       padding: 10px
  //     }
  //     table th{
  //       padding: 10px
  //     }
  //     </style>
  //     <h1>Inscrições</h1>
  //   <table border="1">`;

  //     html += `
  //         <tr>
  //         <th>ID</th>
  //         <th>Evento</th>
  //         <th>Usuario</th>
  //         <th>Status</th>
  //         </tr>`;
  //     dados.forEach(function (dado) {
  //       html += `<tr>
  //             <td>${dado.id}</td>
  //             <td>${dado.evento}</td>
  //             <td>${dado.usuario}</td>
  //             <td>${dado.status}</td>
  //             </tr>`;
  //     });
  //     html += `</table>`;

  //     console.log(html);

  //     let pdf = await InscricaoController.criarPdf(html);

  //     res.append("Content-Type", "application/x-pdf");
  //     res.append("Content-Disposition", 'attachment; filename="eventos.pdf"');
  //     res.send(pdf);
  // }

  // static async criarPdf(html: string) {
  //     const browser = await puppeteer.launch({ headless: "new" });
  //     const page = await browser.newPage();
  //     await page.setViewport({ width: 1366, height: 768 });
  //     await page.setContent(html);
  //     const pdfBuffer = await page.pdf();
  //     await page.close();
  //     await browser.close();
  //     return pdfBuffer;
  // }

  // async listCsv(req: Request, res: Response): Promise<Response> {
  //     let inscricao: Inscricao[] = await Inscricao.find();

  //     let header =
  //       '"ID";"Data de Início";"Data do Fim";"Horário de Início";"Horário do Fim";"Endereço";"Cidade"\n';
  //     let csv = header;

  //     inscricao.forEach((element) => {
  //       csv += `"${element.id}";"${element.id}";"${element.evento}";"${element.usuario}";"${element.status}";\n`;
  //     });

  //     res.append("Content-Type", "text/csv");
  //     res.attachment("usuarios.csv");
  //     return res.status(200).send(csv);
  // }
}
