const mongoose = require('mongoose');

var Banner = mongoose.model("Banner", {
    bannertext :{type : String},
    calltoaction: {type:String},  
    imagePath : {type: String},
    
})

module.exports = {Banner}