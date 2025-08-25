const express = require("express")

const {
  createNewProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
} = require("../controllers/productController")

const router = express.Router()

router.get("/", getAllProducts)
router.post("/", createNewProduct)
router.get("/:id", getProductById)
router.put("/:id", updateProductById)
router.delete("/:id", deleteProductById)

module.exports = router
