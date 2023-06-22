const User = require("../models/user.model")
const Product = require("../models/product.model")
const ProductAlreadyExists = require('../exceptions/ProductAlreadyExists');
const { error } = require("winston");


exports.getFavourites = function (req, res) {
    const username = req.params.username;

    User.findOne({username:username}, {_id:0,  products:1}, (err, result) => {
        if (err) {
            res.json({status: false, data: err});
        } else {
            console.log(result)
            res.json({ status: true, data: result});
        }
    });
}

exports.removeFromFavourites = function (req, res) {
    const username = req.params.username;
    const product = req.body.product;

    User.updateOne (
        {username: username},
        {
            $pull: {
                products: { product: product }
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


// exports.addToFavourites = function(req, res) {
//     const username = req.params.username;
//     // const product = req.body.products;
//     const name = req.body.products.product;
//     const image = req.body.products.image;
//     const toBeAdded = {
//         product: req.body.products.product,
//         image: req.body.products.image
//     }

//     let alreadyExists = false;
    
//     User.findOne({ username: username }, {_id:0,  products:1},(err, user) => {
//         if (!err) {
//             for (let i = 0; i < user.products.length; i++) {
//                 if (user.products[i].product === name) {
//                     console.log(user.products[i].product, " = ", name);
//                     alreadyExists = true;
//                 }
//             }
//         } 
//     })

    
//     User.updateOne(
//         {username: username},
//         {
//             $push: {
//                 products: toBeAdded
//             }
//         },
//         (err, result, alreadyExists) => {
//             if (err || !alreadyExists) {
//                 res.json({status: false, data: err});
//             } else {
//                 res.json({ status: true, data: result});
//             }
//         }
//     )     
    
// }

exports.addToFavourites = function(req, res) {

    const username = req.body.username;
  
    // const product = req.body.products;
  
    const name = req.body.products.product;
  
    const image = req.body.products.image;
  
    const toBeAdded = {
  
        product: req.body.products.product,
  
        image: req.body.products.image
  
    }
  
  
  
    // let alreadyExists = false;
  
    
  
    User.findOne({ username: username, "products.product": name }, {_id:0,  products:1},(err, user) => {
  
      if (err) {
  
        console.log("problem in finding user with this product");
  
        res.json({status: false, data: err});
  
      } else {
  
        if (!user) {
  
          console.log("user with this product exist");
  
          
  
          User.updateOne(
  
            {username: username},
  
            {
  
                $push: {
  
                    products: toBeAdded
  
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
  
        } else {
  
          console.log("user with this product exist does not exist");
  
          res.json({status: false, data: "user with this product exist does not exist"});
  
        }
  
      }
  
    })
  
  }



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