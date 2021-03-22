import express from "express"
import { BillController } from "../controllers/BillController"

const Bill = express.Router()

Bill.get("/:partyId",BillController.getBill)
Bill.post("/",BillController.addBill)
Bill.patch("/", BillController.updateBill)

export default Bill
