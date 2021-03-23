module.exports = (sequelize, DataTypes) => {
  const farm_sensors = sequelize.define("farm_sensors", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    var1: { type: DataTypes.FLOAT },
    var2: { type: DataTypes.FLOAT },
    var3: { type: DataTypes.FLOAT },
    var4: { type: DataTypes.FLOAT },
    var5: { type: DataTypes.FLOAT },
    var6: { type: DataTypes.FLOAT },
    var7: { type: DataTypes.FLOAT },
    var8: { type: DataTypes.FLOAT },
    var9: { type: DataTypes.FLOAT },
    var10: { type: DataTypes.FLOAT },
    // createdAt: { type: DataTypes.DATE },
    // updatedAt: { type: DataTypes.DATE },
  });
  return farm_sensors;
};
