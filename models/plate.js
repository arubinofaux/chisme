'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plate = sequelize.define('Plate', {
    number: DataTypes.STRING
  }, {});
  Plate.associate = function(models) {
    Plate.hasMany(models.Seen, {
      as: "seens"
    });
  };
  return Plate;
};