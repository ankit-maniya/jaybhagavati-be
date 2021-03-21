import express from "express"
import { PartyController } from "../controllers/PartyController"
import { me } from "../functions/auth"

const Party = express.Router()

Party.get("/", me,PartyController.getParty)
Party.post("/", me,PartyController.addParty)
Party.patch("/", me, PartyController.updateParty)

export default Party
