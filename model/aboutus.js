const mongoose = require('mongoose');
var Aboutus = mongoose.model('Aboutus' , {
   
    title : {type:String},
    content : {type:String},
});
module.exports = {Aboutus};