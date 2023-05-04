const Product = require('../models/product.model')

exports.findAll = function(req, res) {
    console.log('Find All Products')
    Product.find({}, (err, results) => {
        if(err ) {
            res.status(400).json({status: false, data: err});
            console.log("Problem in products", err);
        } else {
            res.status(200).json({status: true, data: results});
            console.log("Succes in reading productts")
        }
    })
}

exports.findOne = function(req, res) {
    const product = req.params.product;

    console.log("Find one product");
    Product.findOne({product: product}, (err, result) => {
        if (err) {
            res.status(400).json({status: false, data: err});
            console.log("Problem in product", err);
        } else if (result === null) {
            res.status(404).json({status: false, data: err});
            console.log("Product not found", err);  
        } else {
            res.status(200).json({status: true, data: result});
            console.log("Succes in reading product")
        }
    }) 
}

exports.create = function(req, res) {

    const newProduct = new Product({
        product: req.body.product,
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity,
        image: req.body.image
    })

    console.log("creata a user");
    newProduct.save((err, result) => {
        if (err) {
            res.status(400).json({status: false, data: err});
            console.log("Problem in creating product", err);
        } else {
            res.status(200).json({status: true, data: result});
            console.log("Succes in creating productts")
        }
    })
}

exports.update = function(req,res) {
    const product = req.body.product;

    const updateProduct = {
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity
    }

    Product.findOneAndUpdate({product: product}, updateProduct, (err, result) => {
        if (err) {
            res.status(400).json({status: false, data: err});
            console.log("Problem in udpating product", err);
        } else if (result === null) {
            res.status(404).json({status: false, data: err});
            console.log("Product not found", err);         
        } else {
            res.status(200).json({status: true, data: result});
            console.log("Succes in updating productts")
        }
    })
}

exports.delete = function(req, res) {
    const product = req.params.product

    Product.findOneAndDelete({product: product}, (err, result) => {
        if (err) {
            res.status(400).json({status: false, data: err});
            console.log("Problem in deleting product", err);
        } else if (result === null) {
            res.status(404).json({status: false, data: err});
            console.log("Product not found", err);   
        } else {
            res.status(200).json({status: true, data: result});
            console.log("Succes in deleting product")
        }
    })
}