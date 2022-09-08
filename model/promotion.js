const mongoose = require ('mongoose');
var Promotion = mongoose.model('Promotion', {
 title : {type:String},
 imagePath : {type:String , require:false},
 videoPath : {type: String , require : true},
 content : {type:String , require: true} 
})

module.exports = {Promotion}