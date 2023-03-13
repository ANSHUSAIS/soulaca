const express = require ('express');
var router = express.Router();
var {Aboutus} = require('../model/aboutus');

const multer =  require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
let url = "https://soulacabucket.s3.ap-south-1.amazonaws.com/";
let path;
let images = {
    left_content_image : "",
    right_content_image : "",
};
const mime_type ={
    "image/png" : "png",
    "image/jpg" : 'jpg',
    "image/jpeg" : 'jpg',
    "image/gif" : 'gif'
}
aws.config.update({
    secretAccessKey: 'Diiew/svkC3A6aRPVVoN3QhMSB8y+3A2EVQhzWsc',
    accessKeyId: 'AKIAWX4GQKYJMZHZFSWH',
    region: 'ap-south-1'
});

var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'soulacabucket',
        key: function (req, file, cb) {
        var newFileName = Date.now() + "-" + file.originalname;
        var fullPath = 'uploads/images/'+ newFileName;
        cb(null, fullPath);
            console.log(req.body);
            path = url + fullPath;
            if(images.left_content_image == ""){
                if(req.body.left_content_type == "file"){
                    images.left_content_image = path;
                }
                else{
                    if(req.body.right_content_type != undefined){
                        if(req.body.right_content_type == "file"){
                            images.right_content_image = path;
                        }
                    }
                }
            }
            else if(images.right_content_image == ""){
                if(req.body.right_content_type != undefined){
                    if(req.body.right_content_type == "file"){
                        images.right_content_image = path;
                    }
                }
            }
        }
    })
});

var docId = require('mongoose').Types.ObjectId ;
router.get('/' ,  (req,res)=>{
    Aboutus.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in retriving data:' + JSON.stringify(err,undefined,2));
        }
    }).sort({title: 'desc'})
})

router.post('/', upload.array("image"),  (req,res)=>{

    var content = new Aboutus ({
        about_type : req.body.about_type,
        left_title : req.body.left_title,
        left_content_type : req.body.left_content_type,
        left_content_image : images.left_content_image,
        left_content_text : req.body.left_content_text,
        right_title : req.body.right_title,
        right_content_type : req.body.right_content_type,
        right_content_image : images.right_content_image,
        right_content_text : req.body.right_content_text,
    })

    content.save((err,doc)=>{
        if(!err){
            images = {
                left_content_image : "",
                right_content_image : "",
            };
            res.send(doc);
        }
        else{
            console.log('error in data send :' + JSON.stringify(err,undefined,2));
        }
    })
})

router.get('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Aboutus.findById(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.put('/:id', upload.array("image"), (req,res)=>{
    // console.log(req.files);return;
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        let existingContent = [];
        Aboutus.findById(req.params.id, (err,doc)=>{
            if(!err){
                existingContent = doc;
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        });
        let l_image = "";
        if(images.left_content_image != ""){
            l_image = images.left_content_image;
        }else{
            if(existingContent.left_content_image != undefined){
                l_image = existingContent.left_content_image
            }
        }

        let r_image = "";
        if(images.right_content_image != ""){
            r_image = images.right_content_image;
        }else{
            if(existingContent.right_content_image != undefined){
                r_image = existingContent.right_content_image
            }
        }
        var content = {
            about_type : req.body.about_type,
            left_title : req.body.left_title,
            left_content_type : req.body.left_content_type,
            left_content_image : l_image,
            left_content_text : req.body.left_content_text,
            right_title : req.body.right_title,
            right_content_type : req.body.right_content_type,
            right_content_image : r_image,
            right_content_text : req.body.right_content_text,
        }
    
        Aboutus.findByIdAndUpdate(req.params.id, {$set:content}, {new:true}, (err,doc)=>{
            if(!err){
                res.send(doc)
            }
            else{
                console.log('error is updating data:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.delete('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Aboutus.findByIdAndRemove(req.params.id, (err,doc)=>{
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