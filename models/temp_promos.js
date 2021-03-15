
module.exports = (sequelize, DataTypes) => {
    const temp_promos = sequelize.define('temp_promos',
        {
            temp_promo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            promo_num : { type: DataTypes.CHAR },
            used : { type: DataTypes.INTEGER },
        },
        
    );

    return temp_promos;
}