
module.exports = (sequelize, DataTypes) => {
    const carts = sequelize.define('carts',
        {
            cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            amount_price : { type: DataTypes.INTEGER },
            cart_status : { type: DataTypes.INTEGER },
        },
        
    );

    carts.associate = function (db){
        carts.belongsTo(db.customers, 
            {foreignKey: 'customer_id', sourceKey:'customer_id'})
        carts.hasMany(db.cart_items, 
            {foreignKey: 'cart_id', sourceKey:'cart_id'})
        carts.hasOne(db.purchases, 
            {foreignKey: 'cart_id', sourceKey:'cart_id'})
    };
    

    return carts;
}