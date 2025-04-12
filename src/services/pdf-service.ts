import { IBoleto } from './../interfaces/IBoleto';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import BoletoRepository from '../repositories/boleto-repository';
import PdfParse from 'pdf-parse';

class PdfService {
  async extractNamesFromPdf(filePath: string): Promise<string[]> {
    try {
      const buffer = await fs.readFile(filePath);
      const data = await PdfParse(buffer);

      const pages = data.text.split('\n');
      const names: string[] = [];

      for (const page of pages) {
        const match = page.match(/Boleto de (.+)/i);
        if (match) {
          names.push(match[1].trim());
        }
      }

      return names;
    } catch (error) {
      console.error('Erro ao extrair nomes do PDF:', error);
      throw new Error('Falha ao processar o PDF. Verifique o formato do arquivo.');
    }
  }

  async splitPdf(filePath: string, fixedOrder: string[]): Promise<void> {
    try {
      const pdfBytes = await fs.readFile(filePath); 
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();

      const boletos = (await BoletoRepository.findAll({})).map(boleto => boleto.get() as IBoleto);
      const orderedBoletos = this.mapBoletosToOrder(fixedOrder, boletos);

      await this.ensureDirectoryExists('uploads/output');

      for (let i = 0; i < pageCount; i++) {
        const outputPath = await this.processPage(pdfDoc, i, orderedBoletos[i]);
        console.log(`PDF salvo em ${outputPath}`);
      }
    } catch (error) {
      console.error('Erro ao dividir o PDF:', error);
      throw new Error('Falha ao processar o PDF. Verifique o formato do arquivo.');
    }
  }

  private async processPage(pdfDoc: PDFDocument, pageIndex: number, boleto): Promise<string> {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
    newPdf.addPage(copiedPage);

    const pdfBytes = await newPdf.save();
    const outputPath = boleto
      ? `uploads/output/${boleto.id}.pdf`
      : `uploads/output/page_${pageIndex + 1}.pdf`;

    await fs.writeFile(outputPath, pdfBytes);
    return outputPath;
  }

  private mapBoletosToOrder(fixedOrder: string[], boletos: IBoleto[]): (IBoleto | undefined)[] {
    return fixedOrder.map(name =>
      boletos.find(boleto => boleto.nome_sacado.trim().toUpperCase() === name.trim().toUpperCase())
    );
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    if (!existsSync(directory)) {
      await fs.mkdir(directory, { recursive: true });
    }
  }
}

export default new PdfService();
