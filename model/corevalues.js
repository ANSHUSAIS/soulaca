const mongoose = require('mongoose');
var Corevalues = mongoose.model('Corevalues' , {
    corevalues_title : {type : String},
    corevalues_image : {type : String},
    corevalues_text : {type : String},
});
module.exports = {Corevalues};