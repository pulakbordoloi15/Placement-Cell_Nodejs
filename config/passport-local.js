const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userSchema');

// Auth user passport

passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback: true ,
   
},
      function( req ,email,password ,done){
        User.findOne({email : email} , function(err , user){
            if(err){
                req.flash('error' , "Employee Not Found")
                return done(err);
            }
           
            
            if(!user || user.password != password  ){
                console.log("Password or Employee Name dosen't matche");
                req.flash('error' , "Employee Name / Password  matche")
                return done(null ,false);
            }

            req.flash('success' , "Login Successfully") 
            return done(null , user);
        })
     }
));

    



passport.serializeUser(function(user , done){
    done(null , user.id);
});


passport.deserializeUser(function(id , done){
    User.findById(id , function(err , user){
        if(err){
            
            req.flash('error' , "Error in finding Employee")
            return done(err)
        }
        return done(null , user);
    })
})



passport.checkAuthentication = function(req,res ,next){ 

   // check if the user is signed in ,then pass on the request to the next function(controllers action)   
   if(req.isAuthenticated()){
       return next();
   }
   // if the user is not Authenticated 
   return res.redirect('/');

}
// set the user for views 
// this is using as a middleware for check the user  signin or not
//  once the user is signIn
passport.setAuthenticatedUser = function(req,res,next){

   if(req.isAuthenticated()){
       res.locals.user = req.user;
 
// req.user contains the current user signed in from the session cookie and we just sending this to the locals for the views
   }
   next();
}




module.exports = passport ;