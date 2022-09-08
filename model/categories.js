const mongoose =  require ('mongoose');
var Category = mongoose.model('Category', {
    categoryname : {type: String}
})
module.exports = {Category};