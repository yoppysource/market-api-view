
module.exports = (sequelize, DataTypes) => {
    const product_orders = sequelize.define('product_orders',
        {
            product_order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            quantity : { type: DataTypes.INTEGER },
            amount_price : { type: DataTypes.INTEGER },
            order_timestamp : { type: DataTypes.INTEGER },
            stock_timestamp : { type: DataTypes.DATE },
        },
        
    );

    product_orders.associate = function (db){
        product_orders.belongsTo(db.providers, 
            {foreignKey: 'provider_id', sourceKey:'provider_id'})
        product_orders.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
    };

    return product_orders;
}