const express =  require ('express');

var router = express.Router();
var objId = require('mongoose').Types.ObjectId;
var {Banner} = require('../model/banner');
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
            var fullPath = 'uploads/soulaca/images/'+ newFileName;
            cb(null, fullPath);
            console.log(fullPath);
            path = fullPath;
        }
    })
});

// const storage = multer.diskStorage({
//     destination :(req,file,cb)=>{
//         cb(null, './images')
//     },
//     filename : (req,file,cb)=>{
//         const name = file.originalname.split(' ').join('-');
//         const ext = mime_type[file.mimetype]
//         cb(null, name + '-' + Date.now() + '.' + ext )
//     }
// })
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

router.get('/:id', (req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Banner.findById(req.params.id,(err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('cannot find banner:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

// router.post('', multer({storage : upload}).single("image"),(req,res)=>{
    router.post('', upload.any(),(req,res)=>{
    // const url = req.protocol + "://" + req.get("host");
 const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
    var banner = new Banner({
        bannertext :req.body.bannertext,
        calltoaction: req.body.calltoaction ,
        imagePath : url + path,
   
    })
    banner.save((err,docs)=>{
        if(!err){
        res.send(docs);
        }
        else{
            console.log('error is banner post:' + JSON.stringify(err, undefined,2))
        }
    })
})
router.put(
    "/:id",
    upload.single("image"),
    (req, res, next) => {
      let imagePath = req.body.imagePath;
      if (req.file) {
        // const url = req.protocol + "://" + req.get("host");
        const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
        imagePath = url + path;
      }
      const banner = {
        _id: req.body.id,
        bannertext :req.body.bannertext,
        calltoaction: req.body.calltoaction ,
        imagePath :imagePath
      
      };
      console.log(banner);
      Banner.findByIdAndUpdate(req.params.id, {$set:banner}, {new:true}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error is updating data:' + JSON.stringify(err,undefined,2));
        }
    })
    }
  );


router.delete('/:id', (req,res)=>{
    Banner.findByIdAndRemove(req.params.id, (err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('error in deleting banner:' + JSON.stringify(err,undefined,2));
        }
    })
})
module.exports = router;