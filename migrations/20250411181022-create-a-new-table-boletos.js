'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('boletos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name_drawn: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lote_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Lotes', // Nome da tabela relacionada
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      digital_line: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('boletos');
  },
};
