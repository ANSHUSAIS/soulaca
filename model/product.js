const mongoose = require ('mongoose');
var Product = mongoose.model('Product', {
    productname : {type : String , required : true},
    category :{type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true},
    size : {type: String , required : false},
    shortdescription : {type: String , required : true},
    shortfeatures : {type: String , required : true},
    amazonLink:{type:String, required:false},
    alibabaLink:{type:String, required:false},
    aliexpressLink:{type:String, required: false},
    shopifyLink : {type : String, required: false},
    amazonLink : {
        amazonUs: {},
        amazonUk:{},
        amazonFrance : {},
        amazonSpain : {},
        amazonItaly : {},
        amazonJapan:{}
    },
    productImages: {
        imagePath: { type : Array},
          colors: { type : Array} 
        },
    // imagePath : {type: Array , colors : Array}, 
    videopath : {type: String, required : false},
    productdetails : {type:String, required: true},
    Isfeatured : {type:Boolean, required:true},
}) 

module.exports = {Product}