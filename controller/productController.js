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
       })
       
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
       })
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
        })
        }
    })


router.post('', upload.any(), (req,res)=>{
    // const url = req.protocol + "://" + req.get("host");
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
    //  if(req.body.colors) {
    //      let allcolors = req.body.colors;
    //      imagecolors = [];
    //      for (let i = 0; i< allcolors.length ; i++){
    //         imagecolors.push(allcolors);
    //      }
    //  }
    var product = new Product({
        productname : req.body.productname,
        category : req.body.category,
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
        Isfeatured : req.body.Isfeatured
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
      console.log(req.body.shortfeatures);
      const product = {
        _id: req.body.id,
        productname : req.body.productname,
        category : req.body.category,
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
        Isfeatured : req.body.Isfeatured
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
        Product.find(  {categories: req.params.id }  ,(err,docs)=>{
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