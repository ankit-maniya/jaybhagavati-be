import express from "express"
import { TestController } from "../../controllers/Comman/TestController.js"

const Test = express.Router()

// Test.get("/",TestController.getBalancePartyWise)
// Test.post("/",TestController.addBalance)
Test.get("/", TestController.updateFunction)
// Test.delete("/", TestController.updateBalance)

export default Test
