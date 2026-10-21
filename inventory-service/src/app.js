const express = require("express")
const app = express()
const PORT = 4002

const inventoryRoutes = require("./routes/inventory.routes")
const { startRabbit } = require("./messaging/index")

app.use(express.json())
app.use(express.urlencoded({extended:true}))


//starting rabbitmq
startRabbit();

app.use('/inventory', inventoryRoutes )

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})