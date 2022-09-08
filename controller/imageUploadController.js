const express =  require ('express');
var router = express.Router();
var objId = require('mongoose').Types.ObjectId;
var {ImageUpload} = require('../model/imageupload');
const multer =  require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
let path;
const mime_type ={
    "image/png" : "png",
    "image/jpg" : 'jpg',
    "image/jpeg" : 'jpg',
    "image/gif" : 'gif'
}
aws.config.update({
    secretAccessKey: 'Q4z4BzMVtCc0LByylbnzHCIY9l12tZ6XD91KkHmC',
    accessKeyId: 'AKIAJDVWBHRCBWZZ27IQ',
    region: 'ap-south-1'
});

var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swicn-mean-app',
        key: function (req, file, cb) {
    var newFileName = Date.now() + "-" + file.originalname;
    var fullPath = 'uploads/editorimages/'+ newFileName;
    cb(null, fullPath);
    console.log(fullPath);
    path = fullPath;
    console.log(path);
        }
    })
});


router.get('', (req,res)=>{
    Banner.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in getting banners:' +JSON.stringify(err,undefined,2));
        }
    })
})



// router.post('', multer({storage : upload}).single("image"),(req,res)=>{
    router.post('', upload.any(),(req,res)=>{
    // const url = req.protocol + "://" + req.get("host");
 const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
    var image = new ImageUpload({
        
        imageUrl : url + path,
   
    })
    image.save((err,docs)=>{
        if(!err){
        res.send(docs);
        // res.status(200).send({
        //     "status":true, 
        //     "originalName":'demoImage.jpg', 
        //     "generatedName":'demoImage.jpg', 
        //     "msg":"Image upload successful", 
        //     "imageUrl": imageUrl
        // })
        }
        else{
            console.log('error is banner post:' + JSON.stringify(err, undefined,2))
        }
    })
})

module.exports = router;