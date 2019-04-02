var mongoose = require("mongoose");

  var clickSchema = mongoose.Schema({
      clickTime: String

}, {
  usePushEach: true
});

module.exports = mongoose.model("Click", clickSchema);