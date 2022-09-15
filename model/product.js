const mongoose = require ('mongoose');
var Product = mongoose.model('Product', {
    productname : {type : String , required : true},
    category :{type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true},
    subcategory :{type: mongoose.Schema.Types.ObjectId, ref: 'subcategory', required: true},
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
    product_finder :any = {
        model_number : {
            type : String,
        },
        display_size : {
            type : String,
        },
        front_pane : {
            type : String,
        },
        resolution : {
            type : String,
        },
        dust_proof : {
            type : String,
        },
        wall_mount : {
            type : String,
        },
        visa_pattern : {
            type : String,
        },
        connections : {
            type : String,
        },
        speaker : {
            type : String,
        },
        operating_systems : {
            type : String,
        },
        storage : {
            type : String,
        },
        tv_power : {
            type : String,
        },
        remote_control_supplied : {
            type : String,
        },
        tv_dimesions : {
            type : String,
        },
        recess_wall_dimensions : {
            type : String,
        },
        parking_includes : {
            type : String,
        },
        special_features : {
            type : String,
        },
        tunner : {
            type : String,
        },
        mouse_pointer : {
            type : String,
        },
        voice_control : {
            type : String,
        },
        touch_keys : {
            type : String,
        },
        touch_screen : {
            type : String,
        },
        wifi : {
            type : String,
        },
        brightness : {
            type : String,
        }
      }
}) 

module.exports = {Product} 