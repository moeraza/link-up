var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    Link                    = require("./models/links"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash");
    
mongoose.connect("mongodb://localhost/linkup");
var app = express();
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());


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
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
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
        _id: new mongoose.Types.ObjectId(),
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
            req.flash("error", err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to LinkUp " + user.username);
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
    req.flash("success", "Logged you out!");
    res.redirect("/");
});


// USER PROFILE
app.get("/profile/:user_id", function(req, res) {
    User.findById(req.params.user_id).
    populate("links").
    exec(function(err, foundUser){
        if(err){
            console.log("Reached and error:", err);
        } else {
            console.log("found user and should have populated:",foundUser);
            res.render("profile/show", {currentUser: foundUser})
        }
    })
});

app.get("/profile/:user_id/new", function(req, res) {
  User.findById(req.params.user_id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
      res.render("profile/new", {currentUser: foundUser});
    })
  });

// CREATE - add a new link to user profile...
app.post("/profile/:user_id", isLoggedIn, function(req, res) {
  var newLink = {
    name: req.body.name,
    text: req.body.text
  };
  
  User.findById(req.params.user_id, function(err, foundUser) {
      if(err){
          console.log("errror found:", err)
      } else{
          Link.create(newLink, function(err, link) {
              if(err){
                  req.flash("error", "Something went wrong");
                  console.log(err);
              } else {
                  link.author.id = req.user._id;
                  link.author.username = req.user.username;
                  link.save();
                  foundUser.links.push(link);
                  foundUser.save();
                  console.log(link);
                  req.flash("success", "Successfully added link");
                  res.redirect("/profile/" + foundUser.id);
                  
              }
          });
      }
  });

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("linkUp Server Started.....");
})