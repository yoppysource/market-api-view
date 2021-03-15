
module.exports = (sequelize, DataTypes) => {
    const appinfos = sequelize.define('appinfos',
        {
            min_version: { type: DataTypes.CHAR },
            
        },
        
    );
    return appinfos;
}