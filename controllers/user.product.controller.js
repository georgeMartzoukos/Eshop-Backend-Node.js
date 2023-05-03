const User = require("../models/user.model")

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


// exports.create = function(req, res) {
//     const username = req.params.username;
//     const newProducts = req.body.products;

//     User.findOne({ username: username }, (err, user) => {
//         if (err) {
//             res.json({ status: false, data: err });
//         } else if (!user) {
//             res.json({ status: false, data: "User not found" });
//         } else {
//             // Check for duplicates in existing products array
//             const existingProducts = user.products.map(p => p.product);
//             const duplicates = newProducts.filter(p => existingProducts.includes(p.product));

//             if (duplicates.length > 0) {
//                 res.json({ status: false, data: "Duplicate products not allowed" });
//             } else {
//                 // Add new products to array using $addToSet
//                 User.updateOne(
//                     { username: username },
//                     { $push: { products:  newProducts  } },
//                     (err, result) => {
//                         if (err) {
//                             res.json({ status: false, data: err });
//                         } else {
//                             res.json({ status: true, data: result });
//                         }
//                     }
//                 );
//             }
//         }
//     });
// }


exports.buy = function(req, res) {
    const username = req.params.username;
    const products = req.body.cartList;

    User.updateOne(
        { username: username },
        {
            $push: {
                purchases: { products: products }
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


// exports.buy = async function(req, res, next) {
//     try {
//       const  username  = req.params.username;
//       const  products  = req.body.cartList;
  
//       // Validate the request body
//     //   if (!Array.isArray(cartList)) {
//     //     return res.status(400).json({ error: 'Invalid request body' });
//     //   }
  
//       // Update the user's purchase history
//       const result = await User.updateOne(
//         { username },
//         {
//           $push: {
//             purchases: { products: products }
//           }
//         }
//       );
  
//       // Return a response
//       return res.status(200).json({ status: true, data: result });
//     } catch (err) {
//       // Pass any errors to the centralized error handler
//       return next(err);
//     }
//   };
  



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