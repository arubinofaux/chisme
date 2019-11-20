'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Seens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      confidence: {
        type: Sequelize.FLOAT
      },
      processing_time_ms: {
        type: Sequelize.FLOAT
      },
      plateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Plates',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Seens');
  }
};