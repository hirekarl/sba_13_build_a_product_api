const path = require("path")
const { STATIC_ROOT } = require("../utils")

const Product = require("../models/Product")
const mockProducts = require("../data/mockProducts")

const createAllPage = path.join(STATIC_ROOT, "createAll.html")
const deleteAllPage = path.join(STATIC_ROOT, "deleteAll.html")

// Errors
class ValueError extends Error {
  constructor(message) {
    super(message)
    this.name = "ValueError"
  }
}

// HTTP Response Operations
const handle400 = (res, error) => {
  console.error(`${error.name}: ${error.message}`)
  res.status(400).send(`There was a problem with your request: ${error}`)
}

const handle404 = (res, id, operation) => {
  res.status(404).send(`${operation} failed: Product with id ${id} not found.`)
}

// HTTP Request Operations
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

    if (!foundProduct) {
      handle404(res, req.params.id, "GET")
      return
    }

    res.json(foundProduct)
  } catch (error) {
    handle400(res, error)
  }
}

const updateProductById = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id)

    if (!foundProduct) {
      handle404(res, req.params.id, "PUT")
      return
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      foundProduct._id,
      req.body,
      { new: true }
    )
    res.json(updatedProduct)
  } catch (error) {
    handle400(res, error)
  }
}

const deleteProductById = async (req, res) => {
  try {
    const foundProduct = Product.findById(req.params.id)

    if (!foundProduct) {
      handle404(res, req.params.id, "DELETE")
      return
    }

    await Product.findByIdAndDelete(foundProduct._id)
    res.send(`Product with id ${foundProduct._id} successfully deleted.`)
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
    if (minPrice < 0) throw new RangeError("price must be at least 0.")
    if (page < 1) throw new RangeError("page must be at least 1.")

    const filterObject = { price: { $gte: minPrice, $lte: maxPrice } }
    if (category) filterObject.category = category

    const [sortByProperty, sortByOrder] = sortBy.split("_")
    if (
      ![
        "name",
        "description",
        "price",
        "category",
        "inStock",
        "createdAt",
      ].includes(sortByProperty)
    )
      throw new ValueError(
        'sortBy property must be one of "name", "description", "price", "category", "inStock", or "createdAt".'
      )

    const sortByObject = {}
    switch (true) {
      case sortByOrder === "asc":
        sortByObject[sortByProperty] = "asc"
        break
      case sortByOrder === "desc":
        sortByObject[sortByProperty] = "desc"
        break
      case !sortByOrder && ["createdAt", "inStock"].includes(sortByProperty):
        sortByObject[sortByProperty] = "desc"
        break
      case !sortByOrder:
        sortByObject[sortByProperty] = "asc"
        break
      default:
        throw new ValueError('sortBy order must be "asc" or "desc".')
    }

    const products = await Product.find(filterObject)
      .sort(sortByObject)
      .skip((page - 1) * limit)
      .limit(limit)

    res.json(products)
  } catch (error) {
    handle400(res, error)
  }
}

// Convenience Functions
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
