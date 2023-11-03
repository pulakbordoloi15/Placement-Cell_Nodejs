const express = require('express');
const port = 9000;
const app = express();
const cookieParser = require('cookie-parser');
const db = require("./config/mongoose");

const session = require('express-session');
// const passport = require('passport');
const passport = require('./config/passport-local');
const passportLocal = require('./config/passport-local'); 

const mongoStore = require('connect-mongo')(session);

const expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

const router = require('./routes/user')

app.set('view engine', 'ejs' );
app.set('views' ,'./views')

app.use(express.static('./assets'));

app.set('layout extractStyles' , true)
app.set('layout extractScripts' , true)




app.use( session({

    name :'company',
    secret : "rrrrr",
    saveUninitialized : false ,
    resave : false,
    cookie :{
        maxAge : (1000 * 60 * 100)
    },
    store : new mongoStore({
        mongooseConnection : db,
        autoRemove : 'disabled',
    },
    (err)=>{
        console.log("Error" || "connect-mongo")
    }
    )
}))



app.use(express.urlencoded());
app.use(cookieParser());


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(expressLayouts);

app.use(flash());
app.use(customMiddleware.setFlash);


app.use(require('./routes'));


app.listen(port , (err)=>{
   if(err){
    console.log("Error in running server")
   }
   console.log('Server running successfully on port no ',port);
})