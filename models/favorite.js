//Task 1 workshop 4//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create new Mongoose Schema named favoriteSchema//
//two fields- user and campsites//
//each field should have type and ref field, campsite's fields enclosed in array//
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true
});

//Creation of model named Favorite from this Schema//
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;