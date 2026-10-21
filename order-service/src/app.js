require("dotenv").config()
const express = require("express")
const app = express()
const PORT = 4001

const orderRoutes = require("./routes/orders.routes")
const { startRabbit } = require("./messaging/index")


app.use(express.json())
app.use(express.urlencoded({extended:true}))

//starting rabbit
startRabbit();

//routes
app.use('/orders' , orderRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})