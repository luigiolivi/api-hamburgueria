const express = require("express")
const uuid = require("uuid")

const app = express()
const port = 3000
app.use(express.json())


const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({message:"Order not founded"})
    }

    request.orderIndex = index
    request.orederId = id

    next()
}

const checkRequisition = (request, response, next) => {
    const requestMethod = request.method
    const requestUrl = request.originalUrl

    console.log(`[${requestMethod}] - ${requestUrl}`)

    next()
}

app.post("/order", checkRequisition, (request, response) => {
    const { items, name, price } = request.body

    const order = { id:uuid.v4(), items, name, price, status: "Em preparação"}
    orders.push(order)

    return response.status(201).json(order)
})

app.get("/order", checkRequisition, (request, response) => {
    return response.json(orders)
}) 

app.put("/order/:id", checkOrderId, checkRequisition, (request, response) => {
    const index = request.orderIndex
    const id = request.orederId

    const { items, name, price } = request.body

    const updatedOrder = { id, items, name, price, status:"Em preparação" }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete("/order/:id", checkOrderId, checkRequisition, (request, response) => {
    const index = request.orderIndex
    const id = request.orederId

    orders.splice(index,1)

    return response.status(204).json()
})

app.patch("/order/:id", checkOrderId, checkRequisition, (request, response) => {
    const index = request.orderIndex
    const id = request.orederId

    const updatedStatus = "Pronto"

    orders[index].status = updatedStatus

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`😎 Server started on port ${port}`)
})

