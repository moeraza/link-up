var Link = require("../models/links");
var User = require("../models/user");

// all the middleare goes here
var middlewareObj = {};


middlewareObj.checkLinkOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Link.findById(req.params.link_id, function(err, foundLink){
           if(err){
               req.flash("error", "Link not found");
               res.redirect("back");
           }  else {
               // does user own the link?
               console.log("this is the ownership middleware, here is the link you clicked on: ",foundLink );
               if(foundLink.author.id.equals(req.user._id)) {
                   next();
                   console.log("we have authorized that you own this link")
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkPageOwnership = function(req, res, next){
    console.log("middleware, logged in user:", req.user._id, req.user.username);
    console.log("username in url:", req.params.username);
    if(req.user.username === req.params.username){
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
    
}


module.exports = middlewareObj;