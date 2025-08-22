const express = require("express")

const Product = require("../models/Product")

const router = express.Router()

const handle400 = (res, error) => {
  console.error(error)
  res.sendStatus(400)
}

router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    handle400(res, error)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id)
    res.json(foundProduct)
  } catch (error) {
    handle400(res, error)
  }
})

router.put("/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body)
    res.sendStatus(204)
  } catch (error) {
    handle400(res, error)
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    handle400(res, error)
  }
})

router.get("/", async (req, res) => {
  const category = req.query.category || {}
  const minPrice = req.query.minPrice || 0
  const maxPrice = req.query.maxPrice || Infinity
  const sortBy = req.query.price || "price_asc"
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  try {
    const products = await Product.find({
      category: category,
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .sort(sortBy === "price_asc" ? { price: "asc" } : { price: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
    
    res.json(products)
  } catch (error) {
    handle400(res, error)
  }
})

module.exports = router
