const express = require ('express');
var router = express.Router();
var {Product} = require('../model/product');
var {Category} = require ('../model/categories');
var docId= require('mongoose').Types.ObjectId;
let galleryImgLocationArray = [];
let imagecolors = [];
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require( 'path' );
const mongoose = require ('mongoose');
const { Subcategory } = require('../model/subcategory');
const { Productenquiry } = require('../model/productenquiry');
const mime_type ={
    "image/png" : "png",
    "image/jpg" : 'jpg',
    "image/jpeg" : 'jpg',
    "image/gif" : 'gif'
}
aws.config.update({
    secretAccessKey: 'Q4z4BzMVtCc0LByylbnzHCIY9l12tZ6XD91KkHmC',
    accessKeyId: 'AKIAJDVWBHRCBWZZ27IQ',
    region: 'ap-south-1',
    correctClockSkew: true,  
});

var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swicn-mean-app',
        key: function (req, file, cb){
            cb( null, 'uploads/images/' + path.basename ( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ));
        }
    })
});
// const storage = multer.diskStorage({
//     destination : function(req, file, cb){
//         cb(null, '../backend/images');
//     },
// filename : function(req, file, cb){
//     const ext = mime_type[file.mimetype]
//     cb(null, Date.now()+ file.originalname + '.' + ext);
// }

// })

// const upload = multer({storage : storage,})

router.get('',(req, res)=>{

    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage
    var query = {}
    if(pageSize && currentPage){
        query.skip = pageSize * (currentPage - 1)
  query.limit = pageSize
        Product.find({},{},query, function(err,data) {
            if(!err){
                res.send(data)
            }
            else{
                console.log("Error:" + JSON.stringify(err,undefined,2));
            }
        }).populate({
            path: 'category',
            model: Category
       }).sort({_id : 'desc'})
       
    }
    else{
        Product.find((err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
            }
        }).sort({productname : 'asc'}).populate({
            path: 'category',
            model: Category
       }).sort({_id : 'desc'})
    }

})
// live search

// router.get('',(req, res)=>{

//     const searchdata = req.body.searchData.replace(/\s+/, "");
//     if(searchdata){
//         Product.find( { productname: { $regex: searchdata , $options: 'i'} } ,(err,docs)=>{
//             if(!err){
//                 res.send(docs);
//             }
//             else{
//                 console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
//             }
//         }).sort({productname : 'asc'})
       
//     }
//     else{
//         Product.find((err,docs)=>{
//             if(!err){
//                 res.send(docs);
//             }
//             else{
//                 console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
//             }
//         }).sort({productname : 'asc'})
//     }

// })
    router.get('',(req, res)=>{
        Product.find( {'Isfeatured': true} ,(err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
            }
        }).sort({productname : 'asc'})
    })
    
    router.get('/:id',(req,res)=>{
        if(!docId.isValid(req.params.id)){
            res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
        }
        else{
            Product.findById(req.params.id , (err,docs)=>{
                if(!err){
                    res.send(docs);
                }
                else{
                    console.log('Error in getting blog details: ' + JSON.stringify(err,undefined,2));
                }
            }).populate({
                path: 'category',
                model: Category
        }).populate({
            path: 'subcategory',
            model: Subcategory
        })
        }
    })


router.post('', upload.any(), (req,res)=>{
    // const url = req.protocol + "://" + req.get("host");

    const productFinder = {
        model_number : req.body.model_number,
        display_size : req.body.display_size,
        front_pane : req.body.front_pane,
        resolution : req.body.resolution,
        dust_proof : req.body.dust_proof,
        wall_mount : req.body.wall_mount,
        visa_pattern : req.body.visa_pattern,
        connections : req.body.connections,
        speaker : req.body.speaker,
        operating_systems : req.body.operating_systems,
        storage : req.body.storage,
        tv_power : req.body.tv_power,
        remote_control_supplied : req.body.remote_control_supplied,
        tv_dimesions : req.body.tv_dimesions,
        recess_wall_dimensions : req.body.recess_wall_dimensions,
        parking_includes : req.body.parking_includes,
        special_features : req.body.special_features,
        tunner : req.body.tunner,
        mouse_pointer : req.body.mouse_pointer,
        voice_control : req.body.voice_control,
        touch_keys : req.body.touch_keys,
        touch_screen : req.body.touch_screen,
        wifi : req.body.wifi,
        brightness : req.body.brightness
      }

    if (req.files) {
        let fileArray = req.files,
        fileLocation;
      galleryImgLocationArray = [];
    for ( let i = 0; i < fileArray.length; i++ ) {
     fileLocation = fileArray[ i ].location;
     console.log( 'filenm', fileLocation );
    
     galleryImgLocationArray.push( fileLocation )
    }
  
      }
    var product = new Product({
        productname : req.body.productname,
        category : req.body.category,
        subcategory : req.body.subcategory,
        size : req.body.size,
        shortdescription: req.body.shortdescription,
        shortfeatures : req.body.shortfeatures,
        alibabaLink:req.body.alibabaLink,
        aliexpressLink:req.body.aliexpressLink,
        shopifyLink : req.body.shopifyLink,
        amazonLink:  {
            amazonUs : req.body.amazonUs,
            amazonUk : req.body.amazonUk,
            amazonFrance : req.body.amazonFrance,
            amazonSpain : req.body.amazonSpain,
            amazonItaly : req.body.amazonItaly,
            amazonJapan : req.body.amazonJapan
        },
        productImages: {
            imagePath: galleryImgLocationArray,
            colors: req.body.colors
        },
        videopath : req.body.videopath,
        productdetails : req.body.productdetails,
        Isfeatured : req.body.Isfeatured,
        product_finder : productFinder
    })
    product.save((err,docs)=>{
        if(!err){
            res.send(docs)
        }
        else{
            console.log('Error in saving blog :' +JSON.stringify(err, undefined,2));
        }
    })
})

// Get Product Finder
router.post('/get-productfinder', async (req, res, next)=>{
    const products = await Product.find({
        _id: {
            $in: req.body
        }
    });

    if(!products){
        res.json({ message : 'No Products Found', code : 404, data : []});
    }

    res.json({ message : 'Success', code : 200, data : products});
});

// Product Finder

router.post('/product-finder', async (req,res)=>{

    // Getting all the params
    let query = {
        category : req.body.category !== '' ? req.body.category : null,
        'product_finder.model_number' : req.body.model_number,
        'product_finder.display_size' : req.body.display_size,
        'product_finder.front_pane' : req.body.front_pane,
        'product_finder.resolution' : req.body.resolution,
        'product_finder.dust_proof' : req.body.dust_proof,
        'product_finder.wall_mount' : req.body.wall_mount,
        'product_finder.visa_pattern' : req.body.visa_pattern,
        'product_finder.connections' : req.body.connections,
        'product_finder.speaker' : req.body.speaker,
        'product_finder.operating_systems' : req.body.operating_systems,
        'product_finder.storage' : req.body.storage,
        'product_finder.tv_power' : req.body.tv_power,
        'product_finder.remote_control_supplied' : req.body.remote_control_supplied,
        'product_finder.tv_dimesions' : req.body.tv_dimesions,
        'product_finder.recess_wall_dimensions' : req.body.recess_wall_dimensions,
        'product_finder.parking_includes' : req.body.parking_includes,
        'product_finder.special_features' : req.body.special_features,
        'product_finder.tunner' : req.body.tunner,
        'product_finder.mouse_pointer' : req.body.mouse_pointer,
        'product_finder.voice_control' : req.body.voice_control,
        'product_finder.touch_keys' : req.body.touch_keys,
        'product_finder.touch_screen' : req.body.touch_screen,
        'product_finder.wifi' : req.body.wifi,
        'product_finder.brightness' : req.body.brightness,
    };
    
    // Removing params if its null or blank
    query.category == '' || query.category == null  ? delete query.category : '';
    query['product_finder.model_number'] == '' || query['product_finder.model_number'] == null  ? delete query['product_finder.model_number'] : '';
    query['product_finder.display_size'] == '' ||  query['product_finder.display_size'] == null ? delete query['product_finder.display_size'] : '';
    query['product_finder.front_pane'] == '' || query['product_finder.front_pane'] == null ? delete query['product_finder.front_pane'] : '';
    query['product_finder.resolution'] == '' || query['product_finder.resolution'] == null ? delete query['product_finder.resolution'] : '';
    query['product_finder.dust_proof'] == '' || query['product_finder.dust_proof'] == null ? delete query['product_finder.dust_proof'] : '';
    query['product_finder.wall_mount'] == '' || query['product_finder.wall_mount'] == null ? delete query['product_finder.wall_mount'] : '';
    query['product_finder.visa_pattern'] == '' || query['product_finder.visa_pattern'] == null ? delete query['product_finder.visa_pattern'] : '';
    query['product_finder.connections'] == '' || query['product_finder.connections'] == null ? delete query['product_finder.connections'] : '';
    query['product_finder.speaker'] == '' || query['product_finder.speaker'] == null ? delete query['product_finder.speaker'] : '';
    query['product_finder.operating_systems'] == '' || query['product_finder.operating_systems'] == null ? delete query['product_finder.operating_systems'] : '';
    query['product_finder.storage'] == '' || query['product_finder.storage'] == null ? delete query['product_finder.storage'] : '';
    query['product_finder.tv_power'] == '' || query['product_finder.tv_power'] == null ? delete query['product_finder.tv_power'] : '';
    query['product_finder.remote_control_supplied'] == '' || query['product_finder.remote_control_supplied'] == null ? delete query['product_finder.remote_control_supplied'] : '';
    query['product_finder.tv_dimesions'] == '' || query['product_finder.tv_dimesions'] == null ? delete query['product_finder.tv_dimesions'] : '';
    query['product_finder.recess_wall_dimensions'] == '' || query['product_finder.recess_wall_dimensions'] == null ? delete query['product_finder.recess_wall_dimensions'] : '';
    query['product_finder.parking_includes'] == '' || query['product_finder.parking_includes'] == null ? delete query['product_finder.parking_includes'] : '';
    query['product_finder.special_features'] == '' || query['product_finder.special_features'] == null ? delete query['product_finder.special_features'] : '';
    query['product_finder.tunner'] == '' || query['product_finder.tunner'] == null ? delete query['product_finder.tunner'] : '';
    query['product_finder.mouse_pointer'] == '' || query['product_finder.mouse_pointer'] == null ? delete query['product_finder.mouse_pointer'] : '';
    query['product_finder.voice_control'] == '' || query['product_finder.voice_control'] == null ? delete query['product_finder.voice_control'] : '';
    query['product_finder.touch_keys'] == '' || query['product_finder.touch_keys'] == null ? delete query['product_finder.touch_keys'] : '';
    query['product_finder.touch_screen'] == '' || query['product_finder.touch_screen'] == null ? delete query['product_finder.touch_screen'] : '';
    query['product_finder.wifi'] == '' || query['product_finder.wifi'] == null ? delete query['product_finder.wifi'] : '';
    query['product_finder.brightness'] == '' || query['product_finder.brightness'] == null ? delete query['product_finder.brightness'] : '';

    if(Object.keys(query).length === 0){
        res.json({status : 404, message : 'No Column Selected...'});return;
    }
    const productFinder = await Product.find({ ...query });
    res.json({status : 200, data : productFinder, message : 'No Column Selected...'});
})


router.put(("/:id"), upload.any(), (req, res, next) => {
    if (req.files) {
        let fileArray = req.files,
        fileLocation;
        galleryImgLocationArray = [];
      
        for ( let i = 0; i < fileArray.length; i++ ) {
        fileLocation = fileArray[ i ].location;
    
        console.log( 'filenm', fileLocation );
        galleryImgLocationArray.push( fileLocation )
        }
    }

    const productFinder = {
        model_number : req.body.model_number,
        display_size : req.body.display_size,
        front_pane : req.body.front_pane,
        resolution : req.body.resolution,
        dust_proof : req.body.dust_proof,
        wall_mount : req.body.wall_mount,
        visa_pattern : req.body.visa_pattern,
        connections : req.body.connections,
        speaker : req.body.speaker,
        operating_systems : req.body.operating_systems,
        storage : req.body.storage,
        tv_power : req.body.tv_power,
        remote_control_supplied : req.body.remote_control_supplied,
        tv_dimesions : req.body.tv_dimesions,
        recess_wall_dimensions : req.body.recess_wall_dimensions,
        parking_includes : req.body.parking_includes,
        special_features : req.body.special_features,
        tunner : req.body.tunner,
        mouse_pointer : req.body.mouse_pointer,
        voice_control : req.body.voice_control,
        touch_keys : req.body.touch_keys,
        touch_screen : req.body.touch_screen,
        wifi : req.body.wifi,
        brightness : req.body.brightness
    }

    const product = {
        _id: req.body.id,
        productname : req.body.productname,
        category : req.body.category,
        subcategory : req.body.subcategory,
        size : req.body.size,
        shortdescription : req.body.shortdescription,
        shortfeatures : req.body.shortfeatures,
        alibabaLink:req.body.alibabaLink,
        aliexpressLink:req.body.aliexpressLink,
        shopifyLink : req.body.shopifyLink,
        amazonLink:  {
            amazonUs : req.body.amazonUs,
            amazonUk : req.body.amazonUk,
            amazonFrance : req.body.amazonFrance,
            amazonSpain : req.body.amazonSpain,
            amazonItaly : req.body.amazonItaly,
            amazonJapan : req.body.amazonJapan
        },
        productImages: {
            imagePath:  req.body.imagePath || galleryImgLocationArray,
            colors: req.body.colors
        },
        videopath : req.body.videopath,
        productdetails : req.body.productdetails,
        Isfeatured : req.body.Isfeatured,
        product_finder : productFinder
    };

    Product.findByIdAndUpdate(req.params.id, {$set:product}, {new:true}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error while updating data:' + JSON.stringify(err,undefined,2));
        }
    })
});

  router.get('/featured/lists',(req, res)=>{
    Product.find( {'Isfeatured': true} ,(err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
        }
    }).sort({productname : 'asc'})
})

router.get('/category/:id',(req, res)=>{
        Product.find(  {category: req.params.id }  ,(err,docs)=>{
            if(!err){
                res.send(docs);
               console.log(docs); 
            }
            else{
                console.log('Error is fetching products:' +  JSON.stringify(err,undefined,2));
            }
        }).sort({productname : 'asc'}).populate({
            path: 'category',
            model: Category
       })
})

router.get('/subcategory/:id',(req, res)=>{
    Product.find( {subcategory: req.params.id }  ,(err,docs)=>{
        if(!err){
            res.send(docs);
           console.log(docs); 
        }
        else{
            console.log('Error is fetching products:' +  JSON.stringify(err,undefined,2));
        }
    }).sort({productname : 'asc'}).populate({
        path: 'category',
        model: Category
   })
})

router.get('/search/:searchQuery',(req, res)=>{

    const productname = req.params.searchQuery.replace(/\s+/, "");
    console.log(productname);
        Product.find( { productname: { $regex: productname , $options: 'i'} } ,(err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
            }
        }).sort({productname : 'asc'}).populate({
            path: 'category',
            model: Category
       })
    })
router.delete('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Product.findByIdAndRemove(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('error in deleting data :' + JSON.stringify(err, undefined,2) );
            }
        })
    }
})

router.post('/popup-message', upload.any(), (req,res)=>{
    try{
        var productenquiry = new Productenquiry({
            producturl  : req.body.product_url,
            message  : req.body.message,
            name  : req.body.name,
            mobile  : req.body.mobile
        })
        productenquiry.save((err,docs)=>{
            if(!err){
                res.send(docs)
            }
            else{
                console.log('Error in saving blog :' +JSON.stringify(err, undefined,2));
            }
        })
    }catch(err){
        console.log(err);
    }
})

router.get('/data/enquiry',(req, res)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage
    var query = {}
    if(pageSize && currentPage){
        query.skip = pageSize * (currentPage - 1)
        query.limit = pageSize
        Productenquiry.find({},{},query, function(err,data) {
            if(!err){
                res.send(data)
            }
            else{
                console.log("Error:" + JSON.stringify(err,undefined,2));
            }
        }).sort({_id : -1})
    }
    else{
        Productenquiry.find((err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
            }
        })
    }

})

module.exports = router