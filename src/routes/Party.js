import express from "express"
import { PartyController } from "../controllers/PartyController"

const Party = express.Router()

Party.get("/",PartyController.getParty)
Party.post("/",PartyController.addParty)
Party.patch("/", PartyController.updateParty)

export default Party
