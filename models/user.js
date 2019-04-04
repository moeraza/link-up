var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

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
   ],
   clicks: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Click"
       }
       
       ]
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);