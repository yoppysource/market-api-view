
module.exports = (sequelize, DataTypes) => {
    const inventories = sequelize.define('inventories',
        {
            inventory_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },            
            quantity : { type: DataTypes.INTEGER },
            
        },
        
    );

    inventories.associate = function (db){
        inventories.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
    };
    

    return inventories;
}