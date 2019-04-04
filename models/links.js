var mongoose = require("mongoose");

  var linkSchema = mongoose.Schema({
    text: String,
    name: String,
    author : {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }, 
   clicks: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Click"
       }
       
       ]
}, {
  usePushEach: true
});

module.exports = mongoose.model("Link", linkSchema);