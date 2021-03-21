import express from "express"
import OrderController from "../../controllers/Comman/OrderController"
import { me } from "../../functions/auth"

const Order = express.Router()
/** For Authentication  */
Order.use(me)
/** All Order Routes */
// Order.get("/", OrderController.getAllOrder)
// Order.get("/:OrderId", OrderController.getOrder)
// Order.post("/", OrderController.addOrder)
// Order.patch("/", OrderController.updateOrder)
// Order.delete("/:OrderId?", OrderController.deleteOrder)

export default Order
