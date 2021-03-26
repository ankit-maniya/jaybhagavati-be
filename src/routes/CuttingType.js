import express from "express"
import { CuttingTypeController } from "../controllers/CuttingTypeController"

const CuttingType = express.Router()

CuttingType.get("/",CuttingTypeController.getCuttingType)
CuttingType.post("/",CuttingTypeController.addCuttingType)
CuttingType.patch("/", CuttingTypeController.updateCuttingType)

export default CuttingType
