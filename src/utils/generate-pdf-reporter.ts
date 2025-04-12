import { PDFDocument, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import { IBoleto } from '../interfaces/IBoleto';

export async function generateBoletoReport(boletos: IBoleto[]): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const lineHeight = 20;
  const margin = 50;
  const pageWidth = 600; 
  const pageHeight = 800;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  yPosition = addTitle(page, font, yPosition, lineHeight);
  yPosition = addTableHeader(page, font, yPosition, lineHeight);

  for (const boleto of boletos) {
    const row = formatBoletoRow(boleto);

    if (yPosition < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }

    page.drawText(row, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}

function addTitle(page: PDFPage, font: PDFFont, yPosition: number, lineHeight: number): number {
  page.drawText('Relatório de Boletos', {
    x: 50,
    y: yPosition,
    size: 16,
    font,
  });

  return yPosition - lineHeight * 2;
}

function addTableHeader(
  page: PDFPage,
  font: PDFFont,
  yPosition: number,
  lineHeight: number
): number {
  const headers = ['ID', 'Nome Sacado', 'ID Lote', 'Valor', 'Linha Digitável'];
  page.drawText(headers.join(' | '), {
    x: 50,
    y: yPosition,
    size: 12,
    font,
  });

  return yPosition - lineHeight;
}

function formatBoletoRow(boleto: IBoleto): string {
  return [
    boleto.id?.toString(),
    boleto.nome_sacado,
    boleto.id_lote.toString(),
    Number(boleto.valor).toFixed(2),
    boleto.linha_digitavel,
  ].join(' | ');
}
