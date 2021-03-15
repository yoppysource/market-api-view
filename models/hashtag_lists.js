
module.exports = (sequelize, DataTypes) => {
    const hashtag_lists = sequelize.define('hashtag_lists',
        {
            hashtag_list_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        },
        
    );

    hashtag_lists.associate = function (db){
        hashtag_lists.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
        hashtag_lists.belongsTo(db.hashtags, 
            {foreignKey: 'hashtag_id', sourceKey:'hashtag_id'})
    };

    return hashtag_lists;
}