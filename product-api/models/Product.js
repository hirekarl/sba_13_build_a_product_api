const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "description is required."],
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: [true, "category is required."],
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product
