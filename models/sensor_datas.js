
module.exports = (sequelize, DataTypes) => {
    const sensor_datas = sequelize.define('sensor_datas',
        {
            sensor_data_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sensortype : { type: DataTypes.CHAR },
            value : { type: DataTypes.FLOAT },
            date : { type: DataTypes.CHAR },
            location : { type: DataTypes.CHAR },
        },
        
    );

    return sensor_datas;
}