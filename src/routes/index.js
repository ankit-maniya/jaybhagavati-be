import express from "express"
import Loat from "./Loat"
import Party from "./Party"
import User from "./User"
const route = express.Router()

route.get("/", (req, res, next) => {
  res.send("Jaybhagavati Api called!!!")
})

/** User */
route.use("/user", User)
route.use("/party", Party)
route.use("/Loat", Loat)

export default route
