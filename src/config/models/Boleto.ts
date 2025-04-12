import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Boleto extends Model {}

Boleto.init(
  {
    nome_sacado: { type: DataTypes.STRING, allowNull: false },
    id_lote: { type: DataTypes.INTEGER, allowNull: false },
    valor: { type: DataTypes.DECIMAL, allowNull: false },
    linha_digitavel: { type: DataTypes.STRING, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: 'Boleto', tableName: 'boletos', timestamps: false }
);

export default Boleto;
