
module.exports = (sequelize, DataTypes) => {
    const cart_items = sequelize.define('cart_items',
        {
            cart_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            quantity : { type: DataTypes.INTEGER },
            total_price : { type: DataTypes.INTEGER },
        },
        
    );

    cart_items.associate = function (db){
        cart_items.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
        cart_items.hasMany(db.cart_lists, 
            {foreignKey: 'cart_item_id', sourceKey:'cart_item_id'})
    };
    console.log('cart_items models');
    return cart_items;
}