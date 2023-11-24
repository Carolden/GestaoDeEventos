import { Cidade } from '../models/Cidade';
import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';

export class CidadeController {

    async list(req: Request, res: Response): Promise<Response> {
        let city: Cidade[] = await Cidade.find();

        return res.status(200).json(city);
    }


    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let cidade: Cidade = await Cidade.create({
            nome: body.nome,
        }).save();

        return res.status(200).json(cidade);
    }
    async delete(req: Request, res: Response): Promise<Response> {
        let cidade: Cidade = res.locals.cidade;

        cidade.remove();

        return res.status(200).json();
    }

    async find(req: Request, res: Response): Promise<Response> {
        let cidade: Cidade = res.locals.cidade;

        return res.status(200).json(cidade);
    }


    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let cidade: Cidade = res.locals.cidade;

        cidade.nome = body.nome,
            await cidade.save();

        return res.status(200).json(cidade);
    }

    async pdf(req: Request, res: Response) {
        let dados = await Cidade.find();
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
    <h1>Lista de cidades</h1>
  <table border="1">`;

        html += `
        <tr>
        <th>ID</th>
        <th>Nome</th>
        </tr>`;
        dados.forEach(function (dado) {
            html += `<tr>
            <td>${dado.id}</td>
            <td>${dado.nome}</td>
            </tr>`;
        })
        html += `</table>`

        console.log(html);

        let pdf = await CidadeController.criarPdf(html);

        res.append('Content-Type', 'application/x-pdf');
        res.append('Content-Disposition', 'attachment; filename="cidades.pdf"');
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

        let cidades: Cidade[] = await Cidade.find()

        let header = '"ID";"Nome"\n';
        let csv = header;

        cidades.forEach((element) => {
            csv += `"${element.id}";"${element.nome}"\n`;
        });

        res.append("Content-Type", "text/csv");
        res.attachment("usuarios.csv");
        return res.status(200).send(csv);
    }
}