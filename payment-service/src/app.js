require("dotenv").config()
const express = require("express")
const app = express()
const PORT = 4000

const paymentRoutes = require("./routes/payment.routes")
const { startRabbit } = require("./messaging/index")


app.use(express.json())
app.use(express.urlencoded({ extended:true }))

//starting rabbit
startRabbit();

//routes
app.use('/payments' , paymentRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})