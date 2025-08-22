const mongoose = require("mongoose")

const { MONGO_URI } = require("../utils")

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI)
  } catch (error) {
    console.error(error)
  }
}

module.exports = connect
