const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//load new currency type into mongoose to be available to use//
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    //add image field, strong, contains path to the image//
    image: {
        type: String,
        required: true
    },
    //type of number//
    elevation: {
        type: Number,
        required: true
    },
    //cost field- where we use type of currency, min cost of zero//
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    //boolean type, default value of false//
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
    }, 
    {
    timestamps: true
});

const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;