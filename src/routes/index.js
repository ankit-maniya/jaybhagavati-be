import express from "express"
import Bill from "./Bill.js"
import Loat from "./Loat.js"
import Party from "./Party.js"
import User from "./User.js"
import { me } from "../functions/auth.js"
import CuttingType from "./CuttingType.js"
import Balance from "./Balance.js"
import { CronController } from "../cron/index.js"
import { MigrationController } from "../cron/migrationToSql.js"
import Test from "./Comman/Test.js"

const route = express.Router()

route.get("/cron", MigrationController.MigrateLoatTable)
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

