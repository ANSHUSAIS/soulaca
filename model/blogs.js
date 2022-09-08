const mongoose = require('mongoose');
var Blogs = mongoose.model('Blogs', {
    blogname : {type : String},
    postedby : {type : String},
    postingdate : {type : String},
    imagePath :{type:String},
    blogdetails :{type : String}
})

module.exports ={Blogs}