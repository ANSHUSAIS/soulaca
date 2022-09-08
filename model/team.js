const mongoose = require('mongoose');
var Team = mongoose.model('Team', {
    name : {type:String},
    designation:{type:String},
    message:{type:String},
    imagePath : {type:String}
})

module.exports ={Team}