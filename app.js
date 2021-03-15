var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nunjucks = require('nunjucks');
const bodyparser = require('body-parser');
const db = require('./models');

/* 새로운 셋팅 - class로 바꿔서 정리 */


class App {

    constructor() {
        this.app = express();
        // db 접속
        this.dbConnection();
        // 뷰엔진 셋팅
        this.setViewEngine();
        // 미들웨어 셋팅
        this.setMiddleWare();
        // 정적 디렉토리 추가
        this.setStatic();
        // 로컬 변수
        this.setLocals();
        
        // 라우팅
        this.getRouting();
        
        // 404 페이지를 찾을수가 없음
        this.status404();
        
        // 에러처리
        this.errorHandler();
    }


    setMiddleWare() {

        // 미들웨어 셋팅
        this.app.use(logger('dev'));
        this.app.use(bodyparser.json());
        this.app.use(bodyparser.urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
        this.app.use(express.static(path.join(__dirname, 'public')));


    }

    dbConnection() {
        // DB authentication
        db.sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .then(() => {
                console.log('DB Sync complete.');
                return db.sequelize.sync(); // table create sync
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    }
    setViewEngine() {
        // this.app.set('views', path.join(__dirname, 'views'));
        // this.app.set('view engine', 'jade');

        nunjucks.configure('template', {
            autoescape: true,
            express: this.app //위의 app객체 지정
        }) // template 폴더 지정
    }

    setStatic() {
        //this.app.use('/uploads', express.static('uploads'));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use('/image', express.static('public/images'));
    }

    setLocals() {

        // 템플릿 변수
        this.app.use((req, res, next) => {
            this.app.locals.isLogin = true;
            this.app.locals.req_path = req.path;
            next();
        });
        // express에서 현재 url을 변수로 담아 html에서 활용(버튼 활성화)
    }

    getRouting() {
        this.app.use(require('./controllers'))
    }

    status404() {
        this.app.use(function (req, res, next) {
            next(createError(404));
        });
    }

    errorHandler() {

        this.app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

    }

}

module.exports = new App().app;

/* 예전 코드 */
// // Routes loading
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var adminRouter = require('./routes/admin');
// var contactsRouter = require('./routes/contacts');

// var app = express();
// var port = 3000;

// nunjunks.configure('template', {
//   autoescape: true,
//   express: app //위의 app객체 지정
// }) // template 폴더 지정
// app.listen(port, ()=>{
//   console.log('Express 3000 port')
//})
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 미들웨어 셋팅, app.use자체가 미들웨어다.

// app.use(logger('dev')); // logger, 중간에 가로채서 GET, POST등 캐치가능
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({extended: false}));

//image등 외부요소 셋팅
//app.use('/image', express.static('public/images'));

// global view setting
// 표시되는 값은 base.html에서 이 값(isLogin)을 읽어서 표시해줌
// app.use((req, res, next)=>{
//   app.locals.isLogin = false;
//   app.locals.req_path = req.path; 
//   next();
// })// express에서 현재 url을 변수로 담아 html에서 활용(버튼 활성화)

// function vipMiddleWare(req, res, next){
//   console.log('vipMiddleWare middle ware');
//   next();
// } 
// 라우팅은 마지막에
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/admin', adminRouter);
// //app.use('/admin', vipMiddleWare, adminRouter);
// app.use('/contacts', contactsRouter);


/* error는 내가 선언한 모든 것이 끝난 후에 선언해 준다. */

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//module.exports = app;