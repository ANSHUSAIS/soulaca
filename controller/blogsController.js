const express = require ('express');
var router = express.Router();
var {Blogs} = require('../model/blogs');
var docId= require('mongoose').Types.ObjectId;
const multer = require('multer');
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
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_SECRET_KEY_ID,
    region: 'ap-south-1'
});


var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: 'soulacabucket',
    key: function (req, file, cb) {
            var fileExt = file.originalname.split('.').pop();
            var newFileName = Date.now() + "-" + Math.floor((Math.random() * 1000000)) + "." + fileExt;
            var fullPath = 'uploads/images/blogs/'+ newFileName;
            cb(null, fullPath);
            path = fullPath;
        }
    })
});
// const storage = multer.diskStorage(
//     {
//         destination : (req, file, cb)=>{
//             cb(null, "../backend/images")
//         },
//         filename :(req,file,cb)=>{
//             const name= file.originalname.toLocaleLowerCase().split(' ').join('-');
//             const ext = mime_type[file.mimetype]
//             cb(null , name + '-' + Date.now() + '.' + ext)
//         }
//     }
// )
router.get('',(req, res)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage
    var query = {}
    if(pageSize && currentPage){
        query.skip = pageSize * (currentPage - 1)
  query.limit = pageSize
        Blogs.find({},{},query, function(err,data) {
            if(!err){
                res.send(data)
            }
            else{
                console.log("Error:" + JSON.stringify(err,undefined,2));
            }
        })
    }
    else{
    Blogs.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in fetching blogs:' +  JSON.stringify(err,undefined,2));
        }
    }).sort({postingdate : 'desc'})
}
})
router.get('/recent', (req, res) =>{
Blogs.find( (err,docs)=>{
if(!err){
    res.send(docs)
}
else{
    console.log('Error is fetching blogs:' +  JSON.stringify(err,undefined,2));
}
}).sort({postingdate : 'desc'}).limit(4)
})
router.get('/:id',(req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Blogs.findById(req.params.id , (err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('Error in getting blog details: ' + JSON.stringify(err,undefined,2));
            }
        })
    }
})


router.post('',upload.single("image"), (req,res)=>{
//  const url = req.protocol + "://" + req.get("host");
    const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
    var blog = new Blogs({
        blogname  : req.body.blogname,
        postedby  : req.body.postedby,
        postingdate : req.body.postingdate,
        imagePath: url + path ,
        blogdetails : req.body.blogdetails
    })
    blog.save((err,docs)=>{
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
    upload.single("image"),
    (req, res, next) => {
      let imagePath = req.body.imagePath;
      if (req.file) {
        // const url = req.protocol + "://" + req.get("host");
    const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
        imagePath = url + path;
      }
      const blog = {
        _id: req.body.id,
        blogname: req.body.blogname,
        postedby: req.body.postedby,
        postingdate: req.body.postingdate,
        imagePath: imagePath,
        blogdetails : req.body.blogdetails
      };
      console.log(blog);
      console.log(req.params.id);
      Blogs.findByIdAndUpdate(req.params.id, {$set:blog}, {new:true}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error is updating data:' + JSON.stringify(err,undefined,2));
        }
    })
    }
  );
router.delete('/:id',(req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Blogs.findByIdAndRemove(req.params.id, (err,doc)=>{
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