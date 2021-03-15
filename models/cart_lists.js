module.exports = (sequelize, DataTypes) => {
    const cart_lists = sequelize.define('cart_lists', {
            cart_list_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

        },

    );

    cart_lists.associate = function (db) {
        cart_lists.belongsTo(db.carts, {
            foreignKey: 'cart_id',
            sourceKey: 'cart_id'
        })
        cart_lists.belongsTo(db.cart_items, {
            foreignKey: 'cart_item_id',
            sourceKey: 'cart_item_id'
        })
    };

    return cart_lists;
}