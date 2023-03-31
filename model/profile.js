const mongoose = require('mongoose');
var Profile = mongoose.model('Profile' , {
    profile : {type : String},
    
});
module.exports = {Profile};