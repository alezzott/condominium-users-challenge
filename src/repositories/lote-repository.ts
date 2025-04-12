import Lote from '../config/models/Lote';

class LoteRepository {
  async findByNome(nome: string) {
    const result = await Lote.findOne({ where: { nome } });
    return result;
  }
}

export default new LoteRepository();
