import express from "express"
import Bill from "./Bill"
import Loat from "./Loat"
import Party from "./Party"
import User from "./User"
import { me } from "../functions/auth"
import CuttingType from "./CuttingType"
const route = express.Router()

route.get("/", (req, res, next) => {
  res.send("Jaybhagavati Api called!!!")
})

/** User */
route.use("/user", User)
route.use("/party", me, Party)
route.use("/cuttingType", me, CuttingType)
route.use("/Loat", me, Loat)
route.use("/Bill", me, Bill)

export default route
