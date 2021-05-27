//sample partner document given in workshop 2 as guide//
//"name": "Mountain Adventure"//
//"image": "images/breadcrumb-trail.jpg"//
//"featured": true//
//"cost": 1299//
//"description": "Book a 5-day mountain trek with a seasoned outdoor guide! Fly fishing equipment and lessons provided."//

//add mongoose schema and models for partners data- workshop week 2 task 2//
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Use the mongoose-currency library's Currency type for the cost field available to use//
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true //name should be unique//
    },
    image: {
        type:String,
        required: true
    },
    featured: {
        type: Boolean,
        default: true, 
        required: false //all fields should be required except for featured//
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema)

module.exports = Promotion;