import express from "express"
import { PartyController } from "../controllers/PartyController"

const Party = express.Router()

Party.get("/",PartyController.getParty)
Party.get("/:partyId", PartyController.getPartyLoatDateWise)
Party.post("/",PartyController.addParty)
Party.post("/getAllParty/", PartyController.getAllPartyLoatsDateWise)
Party.patch("/", PartyController.updateParty)

export default Party
