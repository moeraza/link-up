var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

// USER SCHEMA BEFORE
var UserSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    avatar: String,
    paid: String,
    firstName: String, 
    lastName: String,
    displayName: String,
    location: String,
    bio: String,
    email: String,
    linkone: String,
    linktwo: String,
    linkthree: String,
    themeColor: String,
    links: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Link"
      }
   ]
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);