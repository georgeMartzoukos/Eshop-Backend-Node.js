const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let addressSchema = new Schema({
    area: {type: String},
    road: {type: String}
}, {_id: false })

let phoneSchema = new Schema({
    type: {type: String},
    number: {type : String}
}, {_id: false})

let productSchema = new Schema({
    product: {type: String},
    cost: {type: Number},
    quantity: {type: Number},
    image:{type: String},
    date: {type: Date, default: Date.now}
}, {_id: false })

let purchaseSchema = new Schema({
    date: { type: Date, default: Date.now },
    products: [productSchema]
});

let favouriteProducts = new Schema({
    products: [productSchema]
})

let userSchema = new Schema({
    username: {
        type: String,
        require: [true, "Username is required field"],
        max: 100,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: [true, "password is required field"],
        max: 100,
    },
    name: {
        type: String,
        max:100
    },
    surname: {
        type: String,
        max:100
    },
    email: {
        type: String,
        require: [true, 'Email is required field'],
        max: 100,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email address is not valid ']
    },
    address : addressSchema ,
    phone: { type: [phoneSchema], null : true},
    products: {type: [productSchema], null : true },
   
    purchases: {     
        type: [purchaseSchema], null : true ,unique: true   
    }

}, {
    collection: 'users' ,
    timestamps: true
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema)