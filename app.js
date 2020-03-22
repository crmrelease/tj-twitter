const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const session = require('express-session')
const path = require('path')
const flash = require('connect-flash')
const passport = require('passport');
require('dotenv').config();

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const { sequelize } = require('./models')
const passportConfig = require('./passport')

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
app.set('port',process.env.PORT||7001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
resave:false,
saveUninitialized:false,
secret:process.env.COOKIE_SECRET,
cookie:{
    httpOnly:true,
    secure:false,
}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/',indexRouter);
app.use('/auth',authRouter);

app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env')==='development'? err:{};
    res.status(err.status||500);
    res.render('error')
})

app.listen(app.get('port'),(req,res,next)=>{
    console.log(`${app.get('port')} 번에서 가져오고 있슴다.`);
})

