const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    product: {
        type: String,
        require: [true, 'product is a required field'],
        max: 100,
        lowercase: true,
        trim: true
    },
    cost: {
        type: Number,
        require: [true, "Cost is a require field"],
    },
    description:{
       type: String,

    } ,
    quantity: {
        type: Number,
        require: [true, "Quantity is required"]
    },
    image: {
        type: String
    }
})

productSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Product',productSchema);