const mongoose = require("mongoose")

const { MONGO_URI } = require("../utils")

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Successfully connected to the database.")
  } catch (error) {
    console.error("Couldn't connect to the database:", error)
    process.exit(1)
  }
}

module.exports = connect
