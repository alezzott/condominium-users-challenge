import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Lote extends Model {}

Lote.init(
  {
    nome: { type: DataTypes.STRING, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: 'Lote', tableName: 'lotes', timestamps: false }
);

export default Lote;
