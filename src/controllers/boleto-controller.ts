import { Request, Response } from 'express';
import BoletoService, { ICsvRow } from '../services/boleto-service';
import CsvParser from '../utils/csv-parser';
import boletoRepository from '../repositories/boleto-repository';
import { buildFilters } from '../utils/filter-boletos';
import { generateBoletoReport } from '../utils/generate-pdf-reporter';
import { IBoleto } from '../interfaces/IBoleto';

class BoletoController {
  async importCsv(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file?.path) {
        res.status(400).json({ error: 'Arquivo CSV não fornecido.' });
        return;
      }

      const data = await CsvParser.parse(req.file.path);
      const result = await BoletoService.importCsv(data as ICsvRow[]);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      res.status(500).json({ error: 'Erro ao importar o arquivo CSV.' });
    }
  }

  async listBoletos(req: Request, res: Response): Promise<void> {
    try {
      const filters = buildFilters(req.query as Record<string, string | undefined>);
      const boletos = (await boletoRepository.findAll(filters)).map(
        boleto => boleto.get() as IBoleto
      );

      if (req.query.relatorio === '1') {
        const pdfBase64 = await generateBoletoReport(boletos);
        res.status(200).json({ base64: pdfBase64 });
        return;
      }

      res.status(200).json(boletos);
    } catch (error) {
      console.error('Erro ao listar boletos:', error);
      res.status(500).json({ error: 'Erro ao listar boletos.' });
    }
  }

  async getBoletos(req: Request, res: Response): Promise<Response> {
    try {
      const filters = buildFilters(req.query as Record<string, string | undefined>);
      const boletos = await boletoRepository.findAll(filters);

      return res.status(200).json(boletos);
    } catch (error) {
      console.error('Erro ao buscar boletos:', error);
      return res.status(500).json({ error: 'Erro ao buscar boletos.' });
    }
  }
}

export default new BoletoController();
