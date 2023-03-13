const express = require('express');
const bodyparser =  require('body-parser');
var app = express();
const path = require('path');
var secure = require('express-force-https');
app.use(bodyparser.json());
const mongoose = require('mongoose');
var aboutusController = require('./controller/aboutusController');
var categoryController = require('./controller/categoriesController');
var subcategoriesController = require('./controller/subcategoriesController');
var jobsController = require('./controller/jobController');
var blogsController =  require ('./controller/blogsController');
var bannerController = require ('./controller/bannerController');
var teamController = require ('./controller/teamController');
var productController = require ('./controller/productController');
var authController = require ('./controller/authController');
var contactController = require('./controller/contactusController');
var candidateController = require ('./controller/candidateController');
var commentController = require('./controller/commentsController');
var imageController = require('./controller/imageUploadController');
var videoController = require('./controller/videoController');
var promotionController = require('./controller/promotionController');
var contentController = require('./controller/contentController');
mongoose
  .connect(
    // "mongodb+srv://manoj:kwpFdlge7lANXh7P@cluster0-m1jet.mongodb.net/test?retryWrites=true&w=majority"
    "mongodb+srv://mongodbuser:3918aKFkUYMx5eOP@cluster0.a1jsexj.mongodb.net/test?retryWrites=true&w=majority"
    , { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });


  // const port = process.env.PORT || 3000;
  const port =  process.env.PORT || 8081;
app.listen(port , ()=>{
    console.log('App is listing at port  :' + port)
})

app.use(secure);
app.use('/api/aboutus', aboutusController);
app.use('/api/category', categoryController);
app.use('/api/subcategory', subcategoriesController);
app.use('/api/jobs', jobsController);
app.use('/api/blogs', blogsController);
app.use('/api/comments', commentController);
app.use('/api/banner', bannerController);
app.use('/api/team', teamController);
app.use('/api/products', productController);
app.use('/api/user', authController);
app.use('/api/contact', contactController);
app.use('/api/candidates', candidateController);
app.use('/api/contentImages' , imageController);
app.use('/api/video', videoController);
app.use('/api/promotion', promotionController);
app.use('/api/content' , contentController);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/resume", express.static(path.join(__dirname, "resume")));
app.use("/", express.static(path.join(__dirname, "angular")));
app.use("/admin", express.static(path.join(__dirname, "angular")));
app.use("**", express.static(path.join(__dirname, "angular")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});