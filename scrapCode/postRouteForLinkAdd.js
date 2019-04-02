
 // THis is the two different ways i can post a link into users profile
 // both dont work rn....

  Link.create(newLink, function(err, link){
    User.findById(req.params.user_id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            foundUser.links.push(link);
            foundUser.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log(data);
                    req.flash("success", "Successfully added link");
                    res.redirect("/profile/" + foundUser.id);
                }
            });
        }
    });
});


  // Look up User by id
  
  User.findById(req.params.user_id, function(err, foundUser) {
    if (err) {
      console.log(err);
      res.redirect("/")
    } else {
        console.log("This is found user b4 push:", foundUser);
        Link.create(req.body.link, function(err, newlyCreatedLink) {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                //add username and id to comment
                newlyCreatedLink.author = req.foundUser._id;
                newlyCreatedLink.author.username = req.foundUser.username;
                newlyCreatedLink.save();
                foundUser.links.push(newlyCreatedLink);
                foundUser.save();
                console.log(newlyCreatedLink,"This is foundUser after", foundUser);
                req.flash("success", "Successfully added link");
                res.redirect("/profile/" + author.id);
        }
      });
    }
    
  })

  User.findById(req.params.user_id, function(err, foundUser) {
    if (err) {
      console.log(err);
      res.redirect("/")
    } else {
        console.log("This is found user b4 push:", foundUser);
        Link.create(req.body.link, function(err, newlyCreatedLink) {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                //add username and id to comment
                newlyCreatedLink.author.id = req.user._id;
                newlyCreatedLink.author.username = req.user.username;
                newlyCreatedLink.save();
                foundUser.links.push(newlyCreatedLink);
                foundUser.save();
                console.log(newlyCreatedLink,"This is foundUser after", foundUser);
                req.flash("success", "Successfully added link");
                res.redirect("/profile/" + author.id);
        }
      });
    }
    
  })
  
  // This is my old get route... The It wouldnt populate the referenced
  // data, so i used a different function..
  app.get("/profile/:user_id", function(req, res) {
  User.findById(req.params.user_id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    foundUser.populate("links");
    res.render("profile/show", {currentUser: foundUser});
    })
  });
  
  
  // LINK SCHEMA BEFORE
  
  var linkSchema = mongoose.Schema({
    text: String,
    name: String,
    author : {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
}, {
  usePushEach: true
});

// USER SCHEMA BEFORE
var UserSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    avatar: String, 
    firstName: String, 
    lastName: String, 
    email: String,
    linkone: String,
    linktwo: String,
    linkthree: String,
    links: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Link"
      }
   ]
});


// CREATE - add a new link to user profile...
app.post("/profile/:user_id", isLoggedIn, function(req, res) {
  var newLink = {
    name: req.body.name,
    text: req.body.text
  };
  
  Link.create(newLink, function(err, link){
    User.findById(req.params.user_id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            link.author.id = req.user._id;
            link.author.username = req.user.username;
            link.save();
            foundUser.links.push(link);
            foundUser.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    
                    console.log(data);
                    req.flash("success", "Successfully added link");
                    res.redirect("/profile/" + foundUser.id);
                }
            });
        }
    });
});

});