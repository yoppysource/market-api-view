
module.exports = (sequelize, DataTypes) => {
    const notification_infos = sequelize.define('notification_infos',
        {
            notification_info_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            attr : { type: DataTypes.CHAR },
        },
        
    );

    notification_infos.associate = function (db){
        notification_infos.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
    };

    return notification_infos;
}