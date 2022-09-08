const express =  require ('express');
var router = express.Router();
var objId = require('mongoose').Types.ObjectId;
var {Promotion} = require('../model/promotion');
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

router.get('', (req,res)=>{
    Promotion.find((err,docs)=>{
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
        Promotion.findById(req.params.id,(err,docs)=>{
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
    router.post('', upload.single("image"),(req,res)=>{
        if(req.file){
            const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
            var promo = new Promotion({
                title  :req.body.title,
                imagePath : url + path,
                content : req.body.content
           
            })
            promo.save((err,docs)=>{
                if(!err){
                res.send(docs);
                }
                else{
                    console.log('error is banner post:' + JSON.stringify(err, undefined,2))
                }
            })
        }
  else{
    var promo = new Promotion({
        title  :req.body.title,
        videoPath : req.body.video,
        content : req.body.content
   
    })
    promo.save((err,docs)=>{
        if(!err){
        res.send(docs);
        }
        else{
            console.log('error is banner post:' + JSON.stringify(err, undefined,2))
        }
    })
  }

})
router.put(
    "/:id",
    upload.single("image"),
    (req, res, next) => {
      let imagePath = req.body.imagePath;
      let promo;
      if (req.file) {
        // const url = req.protocol + "://" + req.get("host");
        const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
        imagePath = url + path;
        promo = {
            _id: req.body.id,
            title :req.body.title,
            imagePath :imagePath,
            content : req.body.content
          }; 
    }
    else{
        promo = {
            _id: req.body.id,
            title :req.body.title,
            videoPath : req.body.video,
            content : req.body.content
          };
    }
  
     
      Promotion.findByIdAndUpdate(req.params.id, {$set:promo}, {new:true}, (err,doc)=>{
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
    Promotion.findByIdAndRemove(req.params.id, (err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('error in deleting banner:' + JSON.stringify(err,undefined,2));
        }
    })
})
module.exports = router;