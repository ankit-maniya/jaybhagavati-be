import express from "express"
import { LoatController } from "../controllers/LoatController"

const Loat = express.Router()

Loat.get("/:partyId?",LoatController.getLoat)
Loat.post("/",LoatController.addLoat)
Loat.patch("/", LoatController.updateLoat)
Loat.delete("/", LoatController.deleteMany)

export default Loat
