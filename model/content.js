const mongoose = require('mongoose');

var Content =  mongoose.model('Content', {
    promotiontype : {type: mongoose.Schema.Types.ObjectId, ref: 'promotions'},
    content : {type: String}
})

module.exports = {Content}