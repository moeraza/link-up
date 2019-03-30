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
    }
}, {
  usePushEach: true
});

module.exports = mongoose.model("Link", linkSchema);