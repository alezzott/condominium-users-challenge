'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.createTable('boletos', {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
     },
     nome_sacado: {
       type: Sequelize.STRING(255),
       allowNull: false,
     },
     id_lote: {
       type: Sequelize.INTEGER,
       references: {
         model: 'lotes', // Nome da tabela relacionada
         key: 'id',
       },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE',
     },
     valor: {
       // Renomeado para consistência
       type: Sequelize.DECIMAL(10, 2),
       allowNull: false,
     },
     linha_digitavel: {
       // Renomeado para consistência
       type: Sequelize.STRING(255),
       allowNull: false,
     },
     ativo: {
       // Renomeado para consistência
       type: Sequelize.BOOLEAN,
       defaultValue: true,
     },
     criado_em: {
       // Renomeado para seguir convenções
       type: Sequelize.DATE,
       defaultValue: Sequelize.NOW,
     },
   });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('boletos');
  },
};
