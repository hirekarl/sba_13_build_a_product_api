const express = require("express")

const {
  getAllProducts,
  createNewProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  createAllProducts,
  deleteAllProducts,
} = require("../controllers/productController")

const router = express.Router()

// Convenience routes for handling mock data
router.get("/createAll", createAllProducts)
router.get("/deleteAll", deleteAllProducts)

// Spec-defined routes
router.get("/", getAllProducts)
router.post("/", createNewProduct)
router.get("/:id", getProductById)
router.put("/:id", updateProductById)
router.delete("/:id", deleteProductById)

module.exports = router
