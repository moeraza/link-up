var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    Link                    = require("./models/links"),
    Click                   = require("./models/clicks"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash");
    // fetch                   = require("node-fetch");

var middleware              = require("./middleware");

// This is to store passwords
require('dotenv').config();



//  ============================================================= //
// Requirments to configure cloudinary and mutler for image upload

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname); //When the file gets uploaded create custom name
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'datalchemy-ai', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ============================================================= //
    
mongoose.connect("mongodb://localhost/linkup");
var app = express();
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true, 
                                limit:'50mb'
}));
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

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render("register"); 
});

var defaultBackground = "background: #6190E8;  /* fallback for old browsers */ background: -webkit-linear-gradient(180deg, #A7BFE8, #6190E8);  /* Chrome 10-25, Safari 5.1-6 */  background: linear-gradient(180deg, #A7BFE8, #6190E8); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ "
                            
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
        linkthree: req.body.linkthree,
        themeColor: defaultBackground
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to LinkUp " + user.username);
            res.redirect("/" + user.username);
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
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
    
});

app.get("/:username/profile", function(req, res){
   res.render("profile/"); 
});
// LOGOUT LOGIC
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("back");
});


// SHOW - USER PROFILE w/ links
app.get("/:username", function(req, res) {
            
    Link.find({"author.username": req.params.username}, function(err, foundLinks){
        if(err){
            console.log("Ran into error finding links",err);
            return res.render("/");
        } else {
            User.findOne({username: req.params.username}, function(err, foundUser) {
                if(err){
                    return console.log("Error finding user", err)
                } else {
                    // var userReq = foundUser;
                    console.log(req.params.username);
                    console.log("Here are the links we found", foundLinks);
                    return res.render("profile/show", {links: foundLinks, username: req.params.username, thisUser: foundUser});
                }
            })


        }
    });
        
});
// ========================================================================== //
// Edit Theme
// ========================================================================== //
app.get("/:username/theme/choose", middleware.checkPageOwnership, function(req, res) {
    res.render("theme/");
});

var colorTheme = {
    "green": "background: #a8ff78; background: -webkit-linear-gradient(180deg, #78ffd6, #a8ff78); background: linear-gradient(180deg, #78ffd6, #a8ff78);",
    "blue": "background: #56CCF2;  /* fallback for old browsers */ background: -webkit-linear-gradient(180deg, #2F80ED, #56CCF2);  /* Chrome 10-25, Safari 5.1-6 */ background: linear-gradient(180deg, #2F80ED, #56CCF2); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */",
    "red": "background: #333333;  /* fallback for old browsers */ background: -webkit-linear-gradient(180deg, #dd1818, #333333);  /* Chrome 10-25, Safari 5.1-6 */ background: linear-gradient(180deg, #dd1818, #333333); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */"

};

app.post("/:username/theme", function(req, res) {
    console.log("HERE is the color you chose:",req.body.radio);
    var chosenColor = req.body.radio;
    console.log("Here is the CSS styling:", colorTheme[chosenColor]);
    User.findOne({username: req.user.username}, function(err, foundUser){
        if(err){
            console.log("ran into error", err)
        } else {
            console.log("Okay we found user", foundUser);
            foundUser.themeColor = colorTheme[chosenColor];
            foundUser.save();
            res.redirect("/"+ req.params.username); 
        }
        
    })
    
});
// ========================================================================== //
// Edit Profile
// ========================================================================== //

// EDIT - edit user profile details
app.get("/:username/customize/custom", middleware.checkPageOwnership, function(req, res) {
    User.findOne({username: req.user.username}, function(err, foundUser) {
        if(err){
            console.log("error, could not find user", err);
        } else {
            Link.find({"author.username": req.params.username}, function(err, foundLinks){
                if(err){
                    conosle.log("Error", err)
                }  else {
                    console.log("found logged in user:", foundUser.username);
                    res.render("customize/", {currentUser: foundUser, links: foundLinks});
                }
            })

        }
        
    });
});


// UPDATE - put route to update user profile data
app.put("/:username/customize", middleware.checkPageOwnership, function(req, res){
    var profileData = {
                        displayName: req.body.displayName, 
                        location: req.body.location, 
                        bio: req.body.bioTextBox
    };
    // res.send(profileData);
    User.findByIdAndUpdate(req.user._id, profileData, function(err,  updateProfile){
       if(err){
           console.log("Error updating profile: ", err);
       } else {
           res.redirect("/"+req.params.username);
       }
    });
});

// UPDATE - upload new user avatar
app.post("/:username/picupload", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
       var newImage = {avatar: result.secure_url};
       User.findByIdAndUpdate(req.user._id, newImage, function(err, updatedImage) {
           if (err) {
               req.flash('error', err.message);
               return res.redirect('back');
           }
           res.redirect("/" + req.params.username + "/picupload/edit");
       });
        
    });
});

app.get("/:username/picupload/edit", function(req, res) {
   res.render("customize/editpic", {thisUser: req.user}) 
});

app.post("/:username/picupload/edit/post", function(req, res) {
    cloudinary.v2.uploader.upload(req.body.imgInputField, function(error, result) {
        console.log(result, error); 
        var newImage = {avatar: result.secure_url};
        User.findByIdAndUpdate(req.user._id, newImage, function(err, updatedImage) {
           if (err) {
               req.flash('error', err.message);
               return res.redirect('back');
           }
           res.redirect("/" + req.params.username);
       });
        
    });


    console.log("Here is data we got back", req.body.imgInputField);
});


// ========================================================================== //
// LINKS - Creating, editing, deleting, updating. 
// ========================================================================== //

// CREATE - add new link
app.get("/:username/new", function(req, res) {
  User.findOne({username: req.params.username}, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
      res.render("profile/new", {currentUser: foundUser});
    })
  });



// CREATE - add a new link to user profile...
app.post("/:username", middleware.isLoggedIn, function(req, res) {
  var newLink = {
    name: req.body.name,
    text: "http://" + req.body.text
  };
  
  User.findOne({username: req.params.username}, function(err, foundUser) {
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
                  res.redirect("/" + foundUser.username);
                  
              }
          });
      }
  });

});

// EDIT - edit link details
app.get("/:username/:link_id/edit", middleware.checkLinkOwnership, function(req, res) {
    Link.findById(req.params.link_id, function(err, foundLink){
        if(err){
            console.log(err)
        } else {
            console.log("We found the link: ", foundLink);
            res.render("profile/edit", {link: foundLink});
        }
    })
});


// UPDATE - put route to update link
app.put("/:username/:link_id",middleware.checkLinkOwnership, function(req, res){
    // find and update the correct link
    var linkdata = {text: req.body.text, name: req.body.name}
    Link.findByIdAndUpdate(req.params.link_id, linkdata, function(err, updatedCampground){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
           //redirect somewhere(show page)
           res.redirect("/" + req.params.username);
       }
    });
});

// DESTROY - delete link
app.delete("/:username/:link_id", middleware.checkLinkOwnership, function(req, res){
    Link.findByIdAndRemove(req.params.link_id, function(err){
        if(err){
            console.log("ERROR:", err)
            res.redirect("/" + req.params.username);
        } else {
            res.redirect("/" + req.params.username);
        }
    })
})



// ========================================================================== //
// Click Counter
// ========================================================================== //

// CREATE ---> POST - Add click counter
app.post('/:username/:link_id', function(req, res){
  var newClick = new Click({
      clickTime: Date(),
  });
  console.log("Here is the generated click from server:", newClick);
  console.log("Here is the user name:", req.params.username);
  console.log("Here is the link id :", req.params.link_id);
  
  Link.findById(req.params.link_id, function(err, foundLink){
      if(err){
          console.log(err);
      } else {
          console.log("found link:", foundLink);
          Click.create(newClick, function(err, click) {
              if(err){
                  req.flash("error", "Something went wrong");
                  console.log(err);
              } else {
                  click.save();
                  foundLink.clicks.push(click)
                  console.log("Here is the click saved in the DB:", click);
                  foundLink.save();
                  console.log("Here is the association", foundLink);
                  req.flash("success", "Successfully added click");
                  res.redirect(foundLink.text);
                  
              }
              
          });
          
      }
      
  });
    
});


// ========================================================================== //
// View Analytics
// ========================================================================== //


app.get("/:username/analytics", middleware.checkPageOwnership, function(req, res){
    Link.find({"author.username": req.params.username}).populate("clicks").exec(function(err, foundLinks){
    if(err){
        console.log(err);
        res.render("/");
    } else {
        console.log(req.params.username);
        console.log(foundLinks);
        res.render("analytics/", {links: foundLinks});
    }
})
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("linkUp Server Started.....");
});