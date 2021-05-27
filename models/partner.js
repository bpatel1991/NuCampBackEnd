//sample partner document given in workshop 2 as guide//
//"name": "Mongo Fly Shop"//
//"image": "images/mongo-logo.png"//
//"featured": false//
//"description": "Need a new fishing pole, a tacklebox, or flies of all kinds? Stop by Mongo Fly Shop."//

//add mongoose schema and models for partners data- workshop week 2 task 1//
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //name should be unique//
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    },
    {
        timestamps: true,
    }
)

//create a Model named Partner from this Schema//
const Partner = mongoose.model('Partner', partnerSchema)

//export the Partner Model from this module//
module.exports = Partner;