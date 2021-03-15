module.exports = (sequelize, DataTypes) => {
    const customers = sequelize.define('customers',
        {
            customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sns_id : { type: DataTypes.CHAR},
            join_platform : { type: DataTypes.CHAR},
            name : { type: DataTypes.CHAR},
            password : { type: DataTypes.CHAR },
            email : { type: DataTypes.CHAR},
            birthdate : { type: DataTypes.CHAR},
            gender : { type: DataTypes.CHAR },
            phone : { type: DataTypes.CHAR },
            address : { type: DataTypes.CHAR },
            createdate : { type: DataTypes.DATE },
            post_code : { type: DataTypes.CHAR },
            detailed_address : { type: DataTypes.CHAR },
            point : { type: DataTypes.INTEGER },
        },
    );    
    customers.associate = function (db){
        customers.hasMany(db.carts,
            {foreignKey: 'customer_id', sourceKey:'customer_id'});
        customers.hasMany(db.purchases,
            {foreignKey: 'customer_id', sourceKey:'customer_id'});
        customers.hasOne(db.customer_logs,
            {foreignKey: 'customer_id', sourceKey:'customer_id'});
    }
    
    return customers;
    
}