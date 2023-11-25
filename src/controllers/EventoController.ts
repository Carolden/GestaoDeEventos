import { Evento } from "../models/Evento";
import { Cidade } from "../models/Cidade";
import { ILike } from "typeorm";
import { Request, Response } from "express";
import puppeteer from "puppeteer";

export class EventoController {
  async list(req: Request, res: Response): Promise<Response> {
    let event: Evento[] = await Evento.find();

    return res.status(200).json(event);
  }

  async create(req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let evento: Evento = await Evento.create({
      descricao: body.descricao,
      dataInicio: body.dataInicio,
      dataFim: body.dataFim,
      horaInicio: body.horaInicio,
      horaFim: body.horaFim,
      local: body.local,
      id_cidade: body.id_cidade,
      id_admin: body.id_admin,
    }).save();

    return res.status(200).json(evento);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    let evento: Evento = res.locals.evento;

    evento.remove();

    return res.status(200).json();
  }

  async find(req: Request, res: Response): Promise<Response> {
    let evento: Evento = res.locals.evento;

    return res.status(200).json(evento);
  }

  async update(req: Request, res: Response): Promise<Response> {
    let body = req.body;
    let evento: Evento = res.locals.evento;

    (evento.descricao = body.descricao),
      (evento.dataInicio = body.dataInicio),
      (evento.dataFim = body.dataFim),
      (evento.horaInicio = body.horaInicio),
      (evento.horaFim = body.horaFim),
      (evento.local = body.local),
      (evento.id_cidade = body.id_cidade),
      (evento.id_admin = body.id_admin),
      await evento.save();

    return res.status(200).json(evento);
  }

  async pdf(req: Request, res: Response) {
    let dados = await Evento.find();
    console.log(dados);

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
    <h1>Lista de Eventos</h1>
  <table border="1">`;

    html += `
        <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Data de Inicio</th>
        <th>Data de Fim</th>
        <th>Hora de Inicio</th>
        <th>Hora de Fim</th>
        <th>Local</th>
        <th>Cidade</th>
        <th>Criado por</th>
        </tr>`;
    dados.forEach(function (dado) {
      html += `<tr>
            <td>${dado.id}</td>
            <td>${dado.descricao}</td>
            <td>${dado.dataInicio}</td>
            <td>${dado.dataFim}</td>
            <td>${dado.horaInicio}</td>
            <td>${dado.horaFim}</td>
            <td>${dado.local}</td>
            <td>${dado.cidade.nome}</td>
            <td>${dado.admin.nome}</td>
            </tr>`;
    });
    html += `</table>`;

    console.log(html);

    let pdf = await EventoController.criarPdf(html);

    res.append("Content-Type", "application/x-pdf");
    res.append("Content-Disposition", 'attachment; filename="eventos.pdf"');
    res.send(pdf);
  }

  static async criarPdf(html: string) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(html);
    const pdfBuffer = await page.pdf();
    await page.close();
    await browser.close();
    return pdfBuffer;
  }

  async listCsv(req: Request, res: Response): Promise<Response> {
    let evento: Evento[] = await Evento.find();

    let header =
      '"ID";"Data de Início";"Data do Fim";"Horário de Início";"Horário do Fim";"Endereço";"Cidade"\n';
    let csv = header;

    evento.forEach((element) => {
      csv += `"${element.id}";"${element.descricao}";"${element.dataInicio}";"${element.dataFim}";"${element.horaInicio}";"${element.horaFim}";"${element.cidade.nome}";"${element.admin.nome}"\n`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("usuarios.csv");
    return res.status(200).send(csv);
  }
}
