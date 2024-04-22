import express from "express"
import { BalanceController } from "../controllers/BalanceController.js"

const Balance = express.Router()

Balance.get("/:partyId?",BalanceController.getBalance)
Balance.get("/year/:partyId",BalanceController.getBalancePartyWise)
Balance.post("/",BalanceController.addBalance)
Balance.patch("/", BalanceController.updateBalance)

export default Balance
