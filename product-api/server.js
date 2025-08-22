const express = require("express")
const connect = require("./db/connection")
const productRoutes = require("./routes/productRoutes")

const { STATIC_ROOT, PORT } = require("./utils")

const app = express()

app.use(express.static(STATIC_ROOT))
app.use(express.json())

app.use("/api/products", productRoutes)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}.`)
})

connect()
