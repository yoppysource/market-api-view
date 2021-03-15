
module.exports = (sequelize, DataTypes) => {
    const providers = sequelize.define('providers',
        {
            provider_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            phone : { type: DataTypes.CHAR },
            address : { type: DataTypes.CHAR },
        },
        
    );

    providers.associate = function (db){
        providers.hasMany(db.product_orders, 
            {foreignKey: 'provider_id', sourceKey:'provider_id'})
        providers.hasMany(db.provider_handles, 
            {foreignKey: 'provider_id', sourceKey:'provider_id'})
    };

    return providers;
}