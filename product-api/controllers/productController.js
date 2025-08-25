const path = require("path")
const { STATIC_ROOT } = require("../utils")

const mockProducts = require("../data/mockProducts")

const createAllPage = path.join(STATIC_ROOT, "createAll.html")
const deleteAllPage = path.join(STATIC_ROOT, "deleteAll.html")

const Product = require("../models/Product")

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

const createNewProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    handle400(res, error)
  }
}

const getProductById = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id)
    res.json(foundProduct)
  } catch (error) {
    handle400(res, error)
  }
}

const updateProductById = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.sendStatus(204)
  } catch (error) {
    handle400(res, error)
  }
}

const deleteProductById = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    handle400(res, error)
  }
}

const getAllProducts = async (req, res) => {
  const category = req.query.category
  const minPrice = req.query.minPrice || 0
  const maxPrice = req.query.maxPrice || Infinity
  const sortBy = req.query.sortBy || "price_asc"
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  try {
    const sortByObject = {}
    switch (true) {
      case sortBy === "price_asc":
        sortByObject.price = "asc"
        break
      case sortBy === "price_desc":
        sortByObject.price = "desc"
        break
      default:
        throw new ValueError('sortBy must be "price_asc" or "price_desc".')
    }

    const findObject = { price: { $gte: minPrice, $lte: maxPrice } }
    if (category) findObject.category = category

    const products = await Product.find(findObject)
      .sort(sortByObject)
      .skip((page - 1) * limit)
      .limit(limit)

    res.json(products)
  } catch (error) {
    handle400(res, error)
  }
}

const createAllProducts = async (_req, res) => {
  try {
    await Product.insertMany(mockProducts)
    console.log("All mock products added to database.")
    res.sendFile(createAllPage)
  } catch (error) {
    handle400(res, error)
  }
}

const deleteAllProducts = async (_req, res) => {
  try {
    await Product.deleteMany({})
    console.log("All products deleted from database.")
    res.sendFile(deleteAllPage)
  } catch (error) {
    handle400(res, error)
  }
}

module.exports = {
  getAllProducts,
  createNewProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  createAllProducts,
  deleteAllProducts,
}
