const mongoose = require('mongoose');
var Aboutus = mongoose.model('Aboutus' , {
    about_type : {type : String},
    left_title : {type : String},
    left_content_type : {type : String},
    left_content_image : {type : String},
    left_content_text : {type : String},
    right_title : {type : String},
    right_content_type : {type : String},
    right_content_image : {type : String},
    right_content_text : {type : String}
});
module.exports = {Aboutus};