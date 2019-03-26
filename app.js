var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    
mongoose.connect("mongodb://localhost/linkup");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
//   res.locals.success = req.flash('success');
//   res.locals.error = req.flash('error');
   next();
});

//============
// ROUTES
//============

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret"); 
});

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        avatar: req.body.avatar,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        linkone: req.body.linkone,
        linktwo: req.body.linktwo,
        linkthree: req.body.linkthree
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/profile");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/profile", function(req, res){
   res.render("profile/"); 
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


// USER PROFILE
app.get("/profile/:user_id", function(req, res) {
  User.findById(req.params.user_id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
      res.render("profile/show", {currentUser: foundUser});
    })
  });



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
})