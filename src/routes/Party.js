import express from "express"
import { PartyController } from "../controllers/PartyController"

const Party = express.Router()

Party.get("/",PartyController.getParty)
Party.get("/deletedParty", PartyController.getAllDeletedParty)
Party.get("/year/:partyId?", PartyController.getPartyLoatYearWise)
Party.get("/data/year", PartyController.getAllPartyLoatYearWise)
Party.get("/single/:partyId",PartyController.getSingleParty)
Party.get("/:partyId", PartyController.getPartyLoatDateWise)
Party.post("/",PartyController.addParty)
Party.post("/getAllParty", PartyController.getAllPartyLoatsDateWise)
Party.patch("/", PartyController.updateParty)
Party.post("/getAllLoatDate", PartyController.getAllEntryDate)
Party.post("/generateAllInvoicePDF", PartyController.generateAllInvoicePDF)

export default Party
