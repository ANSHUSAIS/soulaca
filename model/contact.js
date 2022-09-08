const mongoose = require('mongoose');
var Contacts = mongoose.model('Contacts', {
    name : {type : String},
    contactno : {type : String},
    email: {type : String},
    message :{type:String},
    date :{type : Date}
})

module.exports ={Contacts}