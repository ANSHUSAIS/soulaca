const mongoose =  require('mongoose');

var ImageUpload = mongoose.model("ImageUpload", {
    imageUrl : {type:String}
})
module.exports = {ImageUpload}