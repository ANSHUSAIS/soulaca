const mongoose = require('mongoose');
var Candidates =  mongoose.model('Candidates',{
    name:{type:String},
    email:{type:String},
    phoneno:{type:String},
    intrest:{type:String},
    resumePath:{type:String},
    date:{type:Date}
});

module.exports = {Candidates}