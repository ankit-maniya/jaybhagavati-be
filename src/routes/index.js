import express from "express"
import Bill from "./Bill"
import Loat from "./Loat"
import Party from "./Party"
import User from "./User"
import { me } from "../functions/auth"
import CuttingType from "./CuttingType"
import Balance from "./Balance"
import { CronController } from "../cron"
import Test from "./Comman/Test"

const route = express.Router()

route.get("/cron", CronController.getLoats)
route.get("/", (req, res, next) => {
  res.send("Jaybhagavati Api called!!!")
})

/** User */
route.use("/user", User)
route.use("/test", Test)
route.use("/party", me, Party)
route.use("/cuttingType", me, CuttingType)
route.use("/Loat", me, Loat)
route.use("/Bill", me, Bill)
route.use("/balance", me, Balance)

export default route

