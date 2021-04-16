import express from "express"
import { BalanceController } from "../controllers/BalanceController"

const Balance = express.Router()

Balance.get("/:partyId?",BalanceController.getBalance)
Balance.post("/",BalanceController.addBalance)
Balance.patch("/", BalanceController.updateBalance)

export default Balance
