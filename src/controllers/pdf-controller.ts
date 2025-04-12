import { Request, Response } from 'express';
import PdfService from '../services/pdf-service';

class PdfController {
  async processPdf(req: Request, res: Response): Promise<void> {
    try {
      const validationError = this.validateFile(req.file);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const fixedOrder = await PdfService.extractNamesFromPdf(req.file!.path);

      if (!fixedOrder || fixedOrder.length === 0) {
        res.status(400).json({ error: 'Não foi possível extrair os nomes do PDF.' });
        return;
      }

      await PdfService.splitPdf(req.file!.path, fixedOrder);
      res.status(200).json({ message: 'PDF processado com sucesso!' });
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      res.status(500).json({ error: `Erro ao processar PDF: ${error.message}` });
    }
  }

  private validateFile(file: Express.Multer.File | undefined): string | null {
    if (!file) {
      return 'Nenhum arquivo foi enviado.';
    }

    if (!file.mimetype.includes('pdf')) {
      return 'O arquivo enviado não é um PDF.';
    }

    return null;
  }
}

export default new PdfController();
