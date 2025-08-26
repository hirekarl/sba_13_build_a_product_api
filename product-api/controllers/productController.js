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

// HTTP Error Handlers
const handle400 = (res, error) => {
  console.error(error)
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
  const tags = req.query.tags

  try {
    // Sanity checks
    if (minPrice < 0) throw new RangeError("price must be at least 0.")
    if (page < 1) throw new RangeError("page must be at least 1.")

    // Construct filter
    const filterObj = { price: { $gte: minPrice, $lte: maxPrice } }
    if (category) filterObj.category = category
    if (tags) filterObj.tags = { $in: tags.split(",") }

    // Construct sort
    //
    // NB: sortBy query param expects <sortByProperty>_<sortByOrder>,
    // where sortByProperty is one of "name", "description",
    // "price", "category", "inStock", "createdAt"
    // and sortByOrder is one of "asc" or "desc",
    // e.g., "price_asc" or "category_desc".
    //
    // "createdAt" and "inStock" properties default to "desc"
    // in the absence of a given sortByOrder value;
    // all other properties default to "asc" in the absence
    // of a given sortByOrder value.
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

    const sortByObj = {}
    switch (true) {
      case sortByOrder === "asc":
        sortByObj[sortByProperty] = "asc"
        break
      case sortByOrder === "desc":
        sortByObj[sortByProperty] = "desc"
        break
      // Default to "desc" for createdAt and inStock if no sortByOrder given
      case !sortByOrder && ["createdAt", "inStock"].includes(sortByProperty):
        sortByObj[sortByProperty] = "desc"
        break
      // Default to "asc" for other fields if no sortByOrder given
      case !sortByOrder:
        sortByObj[sortByProperty] = "asc"
        break
      default:
        throw new ValueError('sortBy order must be "asc", "desc", or undefined.')
    }

    // Run query
    const products = await Product.find(filterObj)
      .sort(sortByObj)
      .skip((page - 1) * limit)
      .limit(limit)

    // Return results
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
