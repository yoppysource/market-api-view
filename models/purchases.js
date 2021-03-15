
module.exports = (sequelize, DataTypes) => {
    const purchases = sequelize.define('purchases',
        {
            purchase_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            delivery_address : { type: DataTypes.CHAR },
            delivery_option : { type: DataTypes.INTEGER },
            purchase_status : { type: DataTypes.INTEGER },
            order_timestamp : { type: DataTypes.DATE },
            delivery_timestamp : { type: DataTypes.DATE },
        },
        
    );

    purchases.associate = function (db){
        purchases.belongsTo(db.carts, 
            {foreignKey: 'cart_id', sourceKey:'cart_id'})
        purchases.belongsTo(db.customers, 
            {foreignKey: 'customer_id', sourceKey:'customer_id'})
    };

    return purchases;
}