import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import path from "path"
import { config } from "./configs/config"
import route from "./routes"
import { connectDB } from "./models"
import User from "./models/User"
const app = express()

// middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// get uploaded files
app.get("/file/:imgname", (req, res, next) => {
  const path = config.FILE_STORE_PATH
  return fs.readFileSync(path + "/" + req.params.imgname)
})

// route
app.use("/", route)

// connect db
connectDB().then( async() => {
  console.log("Mongoose connected")
  
  const foundUser = await User.findOne({ email: config.ADMIN_USER.email})
  
  if (!foundUser) {
    await User.create(config.ADMIN_USER)
  }
})

// server start
app.listen(config.PORT, async () => {
  console.log(`Server Start at ${config.PORT_URL}`)
})
