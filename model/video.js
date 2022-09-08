const mongoose = require('mongoose');

var Video = mongoose.model("Video",{
    videoLink : {type:String, require: true}
}) 

module.exports = {Video}