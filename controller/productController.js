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

// Product Finder

router.post('/product-finder', async (req,res)=>{

    let query = {};

    if(req.body.category !== ''){
        query.category = req.body.category;
    }

    if(req.body.model_number !== ''){
        query.model_number = req.body.model_number;
    }

    if(req.body.display_size !== ''){
        query.display_size = req.body.display_size;
    }

    if(req.body.front_pane !== ''){
        query.front_pane = req.body.front_pane;
    }

    if(req.body.resolution !== ''){
        query.resolution = req.body.resolution;
    }

    if(req.body.dust_proof !== ''){
        query.dust_proof = req.body.dust_proof;
    }

    if(req.body.wall_mount !== ''){
        query.wall_mount = req.body.wall_mount;
    }

    if(req.body.visa_pattern !== ''){
        query.visa_pattern = req.body.visa_pattern;
    }

    if(req.body.connections !== ''){
        query.connections = req.body.connections;
    }

    if(req.body.speaker !== ''){
        query.speaker = req.body.speaker;
    }

    if(req.body.operating_systems !== ''){
        query.operating_systems = req.body.operating_systems;
    }

    if(req.body.storage !== ''){
        query.storage = req.body.storage;
    }

    if(req.body.tv_power !== ''){
        query.tv_power = req.body.tv_power;
    }

    if(req.body.remote_control_supplied !== ''){
        query.remote_control_supplied = req.body.remote_control_supplied;
    }

    if(req.body.tv_dimesions !== ''){
        query.tv_dimesions = req.body.tv_dimesions;
    }

    if(req.body.recess_wall_dimensions !== ''){
        query.recess_wall_dimensions = req.body.recess_wall_dimensions;
    }

    if(req.body.parking_includes !== ''){
        query.parking_includes = req.body.parking_includes;
    }

    if(req.body.special_features !== ''){
        query.special_features = req.body.special_features;
    }

    if(req.body.tunner !== ''){
        query.tunner = req.body.tunner;
    }

    if(req.body.mouse_pointer !== ''){
        query.mouse_pointer = req.body.mouse_pointer;
    }

    if(req.body.voice_control !== ''){
        query.voice_control = req.body.voice_control;
    }

    if(req.body.touch_keys !== ''){
        query.touch_keys = req.body.touch_keys;
    }

    if(req.body.touch_screen !== ''){
        query.touch_screen = req.body.touch_screen;
    }

    if(req.body.wifi !== ''){
        query.wifi = req.body.wifi;
    }

    if(req.body.brightness !== ''){
        query.brightness = req.body.brightness;
    }

    
    const productFinder = await Product.find(query);
    console.log(productFinder);
    res.json({data : productFinder});


    // const productFinder = {
    //     model_number : req.body.model_number,
    //     display_size : req.body.display_size,
    //     front_pane : req.body.front_pane,
    //     resolution : req.body.resolution,
    //     dust_proof : req.body.dust_proof,
    //     wall_mount : req.body.wall_mount,
    //     visa_pattern : req.body.visa_pattern,
    //     connections : req.body.connections,
    //     speaker : req.body.speaker,
    //     operating_systems : req.body.operating_systems,
    //     storage : req.body.storage,
    //     tv_power : req.body.tv_power,
    //     remote_control_supplied : req.body.remote_control_supplied,
    //     tv_dimesions : req.body.tv_dimesions,
    //     recess_wall_dimensions : req.body.recess_wall_dimensions,
    //     parking_includes : req.body.parking_includes,
    //     special_features : req.body.special_features,
    //     tunner : req.body.tunner,
    //     mouse_pointer : req.body.mouse_pointer,
    //     voice_control : req.body.voice_control,
    //     touch_keys : req.body.touch_keys,
    //     touch_screen : req.body.touch_screen,
    //     wifi : req.body.wifi,
    //     brightness : req.body.brightness
    //   }

    
})

router.put(
    "/:id",
    upload.any(),
    (req, res, next) => {
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
      console.log(product);
        Product.findByIdAndUpdate(req.params.id, {$set:product}, {new:true}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error is updating data:' + JSON.stringify(err,undefined,2));
        }
    })
    }
  );

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
module.exports = router