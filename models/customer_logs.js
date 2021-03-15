
module.exports = (sequelize, DataTypes) => {
    const customer_logs = sequelize.define('customer_logs',
        {
            customer_log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            lat : { type: DataTypes.FLOAT },
            lng : { type: DataTypes.FLOAT },
            address : { type: DataTypes.CHAR},
            logincnt : { type: DataTypes.INTEGER },
            loginos : { type: DataTypes.CHAR},
            appversion : { type: DataTypes.CHAR},
            logindate : { type: DataTypes.DATE },
        },
        
    );

    customer_logs.associate = function (db){
        customer_logs.belongsTo(db.customers, 
            {foreignKey: 'customer_id', sourceKey:'customer_id'})
        
    };
    

    return customer_logs;
}