
module.exports = (sequelize, DataTypes) => {
    const reviews = sequelize.define('reviews',
        {
            review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            customer_id : { type: DataTypes.INTEGER },
            product_id : { type: DataTypes.INTEGER },
            rating : { type: DataTypes.FLOAT },
            comment : { type: DataTypes.CHAR },
            img_link : { type: DataTypes.CHAR},
        },
        
    );

    reviews.associate = function (db){
        reviews.belongsTo(db.customers, 
            {foreignKey: 'customer_id', sourceKey:'customer_id'})
       /*  reviews.belongsTo(db.products, 
            {foreignKey: 'product_id', sourceKey:'product_id'}) */
        
    };
    

    return reviews;
}