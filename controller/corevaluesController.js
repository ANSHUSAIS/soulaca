const express = require ('express');
var router = express.Router();
var {Corevalues} = require('../model/corevalues');
const multer =  require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
let url = "https://soulacabucket.s3.ap-south-1.amazonaws.com/";
let path;
let image = '';
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
        var fullPath = 'uploads/images/corevalues/'+ newFileName;
        cb(null, fullPath);
        path = url + fullPath;
        if(image == "")
           image = path
        }
    })
});

var docId = require('mongoose').Types.ObjectId ;
router.get('/' ,  (req,res)=>{
    Corevalues.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in retriving data:' + JSON.stringify(err,undefined,2));
        }
    }).sort({title: 'desc'})
})

router.post('/', upload.single("corevalues_image"),  (req,res)=>{
    var content = new Corevalues ({
        corevalues_title : req.body.corevalues_title,
        corevalues_image : image,
        corevalues_text : req.body.corevalues_text
    })

    content.save((err,doc)=>{
        if(!err){
            image = "";
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
        Corevalues.findById(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.put('/:id', upload.single("corevalues_image"), (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }else{
        let existingContent;
        Corevalues.findById(req.params.id, (err,doc)=>{
            if(!err){
                existingContent = doc;
                
                let l_image = "";
                if(image !=  ""){
                    l_image = image;
                }else{
                    if(existingContent.corevalues_image != undefined){
                        l_image = existingContent.corevalues_image
                    }
                }
                var content = {
                    corevalues_title : req.body.corevalues_title,
                    corevalues_image : l_image,
                    corevalues_text : req.body.corevalues_text
                }
                Corevalues.findByIdAndUpdate(req.params.id, {$set:content}, {new:true}, (err,doc)=>{
                    if(!err){
                        image = "";
                        res.send(doc)
                    }
                    else{
                        console.log('error is updating data:' + JSON.stringify(err,undefined,2));
                    }
                })

            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        });
    }
})

router.delete('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Corevalues.findByIdAndRemove(req.params.id, (err,doc)=>{
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