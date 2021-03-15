//create table

module.exports = (sequelize, DataTypes) => {
    const products = sequelize.define('products',
        {
            product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            category : { type: DataTypes.INTEGER },
            name : { type: DataTypes.CHAR },
            retail_price : { type: DataTypes.INTEGER },
            location : { type: DataTypes.CHAR },
            description : { type: DataTypes.CHAR },
            img_path : { type: DataTypes.CHAR },
            sku : { type: DataTypes.CHAR },
            name_eng : { type: DataTypes.CHAR },
            type : { type: DataTypes.CHAR },
            intro : { type: DataTypes.CHAR },
            measure_1 : { type: DataTypes.CHAR },
            measure_2 : { type: DataTypes.CHAR },
            storage_desc : { type: DataTypes.CHAR },
            recipe : { type: DataTypes.CHAR },
            nutrition : { type: DataTypes.CHAR },
            description_img_path : { type: DataTypes.CHAR },
            thumb_img_path : { type: DataTypes.CHAR },
            weights : { type: DataTypes.CHAR },
        } 
    );
    products.associate = function (db){
        products.belongsTo(db.providers, 
            {foreignKey: 'provider_id', sourceKey:'provider_id'})
        products.hasOne(db.notification_infos, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
        products.hasMany(db.hashtag_lists, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
        products.hasMany(db.product_orders, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
        products.hasMany(db.provider_handles, 
            {foreignKey: 'product_id', sourceKey:'product_id'})
    }
    return products;
}

//만들고 app.js의 db sync로 간다