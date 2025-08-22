const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

const STATIC_ROOT = path.resolve(__dirname, "../public")
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

module.exports = { STATIC_ROOT, PORT, MONGO_URI }
