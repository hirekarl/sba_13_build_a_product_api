const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product
