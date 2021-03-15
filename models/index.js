//database table 등을 sync를 하는 곳
var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG

const sequelize = new Sequelize( process.env.DATABASE,
process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00', //한국 시간 셋팅
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

let db = [];

// index.js빼고 각 파일들을 참조해서 테이블을 생성한다.
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js')&& file !== 'index.js' 
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname,
            file));
            db[model.name] = model;
            console.log(model)
    });

Object.keys(db).forEach(modelName => {
    if("associate" in db[modelName]){
        console.log(modelName + ' in for each');
        db[modelName].associate(db); // 모델간의 관계도
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;