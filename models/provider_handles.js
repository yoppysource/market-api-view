
module.exports = (sequelize, DataTypes) => {
    const provider_handles = sequelize.define('provider_handles',
        {
            provider_handle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            prov_price : { type: DataTypes.INTEGER },
        },
        
    );

    provider_handles.associate = function (db){
        provider_handles.belongsTo(db.providers, 
            {foreignKey: 'provider_id', sourceKey:'provider_id'})
        provider_handles.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
    };

    return provider_handles;
}