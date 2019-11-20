'use strict';
module.exports = (sequelize, DataTypes) => {
  const Seen = sequelize.define('Seen', {
    uuid: DataTypes.STRING,
    confidence: DataTypes.FLOAT,
    processing_time_ms: DataTypes.FLOAT,
    plateId: DataTypes.INTEGER
  }, {});
  Seen.associate = function(models) {
    Seen.belongsTo(models.Plate, {
      onDelete: "CASCADE",
      foreignKey: 'plateId', 
      as: 'plate'
    })
  };
  return Seen;
};