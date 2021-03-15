
module.exports = (sequelize, DataTypes) => {
    const hashtags = sequelize.define('hashtags',
        {
            hashtag_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            hashtag : { type: DataTypes.CHAR },
        },
        
    );

    hashtags.associate = function (db){
        hashtags.hasMany(db.hashtag_lists, 
            {foreignKey: 'hashtag_id', sourceKey:'hashtag_id'})
    };

    return hashtags;
}