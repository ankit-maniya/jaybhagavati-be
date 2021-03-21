import express from "express"
import { LoatController } from "../controllers/LoatController"
import { me } from "../functions/auth"

const Loat = express.Router()

Loat.get("/", me,LoatController.getLoat)
Loat.post("/", me,LoatController.addLoat)
Loat.patch("/", me, LoatController.updateLoat)

export default Loat
