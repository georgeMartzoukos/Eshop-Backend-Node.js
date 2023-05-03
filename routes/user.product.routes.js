const express = require('express');
const router = express.Router();

const userProductController = require("../controllers/user.product.controller")

router.get("/findOne/:username", userProductController.findOne);
router.post("/create/:username", userProductController.create);
router.patch("/update", userProductController.update);
router.delete("/delete/:username/:product", userProductController.delete);
router.get("/stats1/:username", userProductController.stats1)
router.post("/buy/:username", userProductController.buy)


module.exports = router;