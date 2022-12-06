const mongoose = require ('mongoose');
var Productenquiry = mongoose.model('Productenquiry', {
    producturl : {type : String , required : true},
    message :{type : String , required : true},
    name :{type : String , required : true},
    mobile :{type : Number , required : true}
})

module.exports = {Productenquiry}