const express = require("express")

const Product = require("../models/Product")

const router = express.Router()

class ValueError extends Error {
  constructor(message) {
    super(message)
    this.name = "ValueError"
  }
}

const handle400 = (res, error) => {
  console.error(`${error.name}: ${error.message}`)
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
  const sortBy = req.query.sortBy || "price_asc"
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  try {
    let sortByObject = {}
    switch (true) {
      case sortBy === "price_asc":
        sortByObject = { price: "asc" }
        break
      case sortBy === "price_desc":
        sortByObject = { price: "desc" }
        break
      default:
        throw new ValueError('sortBy must be "price_asc" or "price_desc".')
    }

    const products = await Product.select({
      category: category,
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .sort(sortByObject)
      .skip((page - 1) * limit)
      .limit(limit)

    res.json(products)
  } catch (error) {
    handle400(res, error)
  }
})

module.exports = router
