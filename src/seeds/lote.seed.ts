import Lote from '../config/models/Lote';
import sequelize from '../config/database';

async function seedLotes() {
  try {
    await sequelize.sync({ force: false });

    await Lote.bulkCreate([
      { nome: '0017', ativo: true, criado_em: new Date() },
      { nome: '0018', ativo: true, criado_em: new Date() },
      { nome: '0019', ativo: true, criado_em: new Date() },
    ]);

    console.log('Lotes adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar lotes:', error);
  }
}

seedLotes();
