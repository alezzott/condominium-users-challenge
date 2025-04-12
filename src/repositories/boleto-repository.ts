import { CreationAttributes, FindOptions } from 'sequelize';
import Boleto from '../config/models/Boleto';

class BoletoRepository {
  async bulkCreate(data: CreationAttributes<Boleto>[]): Promise<Boleto[]> {
    return await Boleto.bulkCreate(data);
  }

  async findAll(options: FindOptions = {}): Promise<Boleto[]> {
    return await Boleto.findAll(options);
  }
}

export default new BoletoRepository();
