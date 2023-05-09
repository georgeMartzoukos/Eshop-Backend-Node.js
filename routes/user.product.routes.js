const express = require('express');
const router = express.Router();

const userProductController = require("../controllers/user.product.controller")

router.get("/getFavourites/:username", userProductController.getFavourites);
router.post("/addToFavourites/:username", userProductController.addToFavourites);
router.patch("/update", userProductController.update);
// router.delete("/delete/:username/:product", userProductController.delete);
router.get("/stats1/:username", userProductController.stats1)
router.post("/buy/:username", userProductController.buy),
router.delete("/removeFromFavourites/:username", userProductController.removeFromFavourites);


module.exports = router;