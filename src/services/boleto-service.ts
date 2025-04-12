import BoletoRepository from '../repositories/boleto-repository';
import LoteRepository from '../repositories/lote-repository';
import { IBoleto } from '../interfaces/IBoleto';
import { ILote } from '../interfaces/ILote';

export interface ICsvRow {
  unidade: string;
  nome: string;
  valor: string;
  linha_digitavel: string;
}

class BoletoService {
  async importCsv(data: ICsvRow[]): Promise<IBoleto[]> {
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Dados de entrada vazios ou inválidos:', data);
      throw new Error('Dados CSV inválidos ou vazios');
    }

    const boletos = await this.processCsvRows(data);

    if (boletos.length === 0) {
      throw new Error(
        'Nenhum boleto foi gerado para salvar. Verifique se os lotes existem no banco de dados.'
      );
    }

    const boletosParaSalvar = boletos.map(boleto => ({
      nome_sacado: boleto.nome_sacado,
      id_lote: boleto.id_lote,
      valor: boleto.valor,
      linha_digitavel: boleto.linha_digitavel,
      ativo: boleto.ativo,
      criado_em: boleto.criado_em,
    }));

    const createdBoletos = await BoletoRepository.bulkCreate(boletosParaSalvar);
    return createdBoletos.map(boleto => boleto.get() as IBoleto);
  }

  async listBoletos(filters: Record<string, unknown>): Promise<IBoleto[]> {
    const boletos = await BoletoRepository.findAll(filters);
    return boletos.map(boleto => boleto.get() as IBoleto);
  }

  private async processCsvRows(data: ICsvRow[]): Promise<IBoleto[]> {
    const boletos: IBoleto[] = [];
    let lotesEncontrados = 0;

    for (const row of data) {
      if (!this.isValidRow(row)) {
        console.warn('Linha com dados incompletos:', row);
        continue;
      }

      const lote = await this.findLote(row.unidade);

      if (lote && lote.id !== undefined) {
        lotesEncontrados++;
        boletos.push(this.createBoleto(row, lote?.id));
      } else {
        console.warn(`ALERTA: Lote não encontrado para unidade ${row.unidade}`);
      }
    }

    console.info(`Total de lotes encontrados: ${lotesEncontrados} de ${data.length}`);
    return boletos;
  }

  private isValidRow(row: ICsvRow): boolean {
    return !!(row.unidade && row.nome && row.valor && row.linha_digitavel);
  }

  private async findLote(unidade: string): Promise<ILote | null> {
    const possibleNames = [`00${unidade}`, unidade];
    for (const name of possibleNames) {
      const lote = await LoteRepository.findByNome(name);
      if (lote) return lote as ILote;
    }
    return null;
  }

  private createBoleto(row: ICsvRow, loteId: number): IBoleto {
    return {
      nome_sacado: row.nome,
      id_lote: loteId,
      valor: parseFloat(row.valor),
      linha_digitavel: row.linha_digitavel,
      ativo: true,
      criado_em: new Date(),
    };
  }
}

export default new BoletoService();
