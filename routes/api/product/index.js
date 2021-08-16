const router = require("express").Router();
const { productModel } = require("../../../models");

router.get("/", (req, res) => {
  res.send("this is products route");
});

router.get("/add", async (req, res) => {
  try {
    const product = await productModel.insertMany(req.body);
    res.json({ message: "product successfully added" });
  } catch (error) {
    res.json({ message: error.message });
  }
});



router.get("/update", async (req, res) => {
  await productModel.updateMany({ qty: 1 });
  res.json("updated");
});

//get product for first time
router.post("/getProduct", async (req, res) => {
  try {
    const getProduct = await productModel
      .find({})
      .select("image qty name price _id keyword");

    res.json(getProduct);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//get specific item 
router.post("/specificProducts", async (req, res) => {
  try {
      const {initial} = req.body;
      const item = initial.toUpperCase();
      const getSpecific = await productModel.find({keywords: item}).select("image qty name price _id keywords");
      res.json(getSpecific)
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { getOnlyId } = req.body;

    const getCartItem = await productModel
      .find({ _id: getOnlyId })
      .select("qty name price image _id");
      
    res.json(getCartItem);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
