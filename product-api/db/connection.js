const mongoose = require("mongoose")

const { MONGO_URI } = require("../utils")

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Established successful connection to the database.")
  } catch (error) {
    console.error("Couldn't connect to the database:", error)
  }
}

module.exports = connect
