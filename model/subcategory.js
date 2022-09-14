
const mongoose =  require ('mongoose');
var Subcategory = mongoose.model('Subcategory', {
    subcategoryname : {
        type : String,
        required : [true, 'Subcategory Name Field Required...'],
        maxLength : [40, 'Name should be maximum of 40 Characters']
    },
    category : {
        type: mongoose.Schema.ObjectId
    },
    categoryname:{
        type: String,
    },
    createdAt :{
        type: Date,
        dafault : Date.now
    }
})
module.exports = {Subcategory};