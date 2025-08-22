const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

module.exports = { PORT, MONGO_URI }
