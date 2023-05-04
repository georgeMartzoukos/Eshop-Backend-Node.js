const User = require("../models/user.model")
const Product = require("../models/product.model")


// exports.isFavourite

exports.findOne = function (req, res) {
    const username = req.params.username;

    User.findOne({username:username}, {_id:0,  products:1}, (err, result) => {
        if (err) {
            res.json({status: false, data: err});
        } else {
            res.json({ status: true, data: result});
        }
    });
}

exports.create = function(req, res) {
    const username = req.params.username;
    const product = req.body.product;
    console.log(req.body.product);
    // const user = User.findOne({username: username});
    // if (user.products)
    // User.findOne({username: username})
    User.updateOne(
        {username: username},
        {
            $push: {
                products: product
            }
        },
        (err, result) => {
            if (err) {
                res.json({status: false, data: err});
            } else {
                res.json({ status: true, data: result});
            }
        }
    )
}



// exports.buy = function(req, res) {
//     const username = req.params.username;
//     const products = req.body.cartList;
    
//     for (let i = 0; i < products.length; i++) {
//         Product.findOne(
//             {product: products[i].product},

//         )
//     }
    

//     User.updateOne(
//         { username: username },
//         {
//             $push: {
//                 purchases: { products: products }
//             }
//         },
//         (err, result) => {
//             if (err) {
//                 res.json({status: false, data: err});
//             } else {
//                 res.json({ status: true, data: result});
//             }
//         }
//     )
// }

exports.buy = async function(req, res) {
    const username = req.params.username;
    const products = req.body.cartList;
    //console.log(products[0].quantity)

    for (let i = 0; i < products.length; i++) {
        try {
            const product = await Product.findOne({ product: products[i].product });
            console.log(product.quantity)
            console.log(products[i].quantity)
            if (product.quantity < products[i].quantity) {
                return res.json({ status: false, message: `Insufficient quantity for product ${product.product}` });
            } 
            let quan = product.quantity - products[i].quantity;
            

            
            console.log(quan)
            Product.findOneAndUpdate(
                { product: products[i].product },
                { quantity: quan },
                { new: true },
                (err, updatedProduct) => {
                  if (err) {
                    return res.json({ status: false, message: err.message });
                  } else {
                    console.log("Product updated:", updatedProduct);
                  }
                }
              );
              
            

        } catch (err) {
            return res.json({ status: false, message: err.message });
        }
    }

    User.updateOne(
        { username: username },
        {
            $push: {
                purchases: { products: products }
            }
        },
        (err, result) => {
            if (err) {
                res.json({ status: false, message: err.message });
            } else {
                res.json({ status: true, message: "Purchase completed successfully" });
            }
        }
    )
}


exports.update = function(req, res) {
    const username = req.body.username;
    const product = req.body.products.product;
    const quantity = req.body.products.quantity;

    User.updateOne(
        {
            username: username,
            'products.product': product
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        },
        (err, result) => {
            if (err) {
                res.json({status: false, data: err});
            } else {
                res.json({ status: true, data: result});
            }
        }
    )
}

exports.delete = function (req, res) {
    const username = req.params.username;
    const product = req.params.product;

    User.updateOne(
        {username: username},
        {
            $push: {
                purchases: {
                    $each: purchase
                }
            }
        },
        (err, result) => {
            if (err) {
                res.json({status: false, data: err});
            } else {
                res.json({ status: true, data: result});
            }
        }

         )

}

exports.stats1 = function (req, res) {
    const username = req.params.username;

    User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: "$products"
        },
        {
            $project: {
                _id:1,
                username: 1,
                products: 1
            }
        },
        {
            $group: {
                _id: {
                    username :"$username",
                    product: "$products.product"
                },
                totalAmmount: {
                    $sum: {
                        $multiply: [
                            "$products.cost", "$products.quantity"
                    ]
                    }
                },
                count: { $sum:1 }
            }
        },
        {
            $sort: {"_id.product":1}
        }
    
    ],
    (err, result) => {
        if (err) {
            res.json({status: false, data: err});
        } else {
            res.json({ status: true, data: result});
        }
    }
)}