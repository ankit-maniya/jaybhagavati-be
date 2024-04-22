import express from "express"
import cors from "cors"

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { config } from "./src/configs/config.js"
import route from "./src/routes/index.js"
import { connectDB } from "./src/models/index.js"
import User from "./src/models/User.js"
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// swagger documentation
const swaggerSpec = swaggerJSDoc(config.SWAGGER_OPTIONS);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// get uploaded files
app.get("/file/:imgname", (req, res, next) => {
  const path = config.FILE_STORE_PATH
  return fs.readFileSync(path + "/" + req.params.imgname)
})

// route
app.use("/", route)

// connect db
connectDB().then(async () => {
  console.log("Mongoose connected")
  // console.log("Postgres connected")

  const foundUser = await User.findOne({ email: config.ADMIN_USER.email })
  // const firebaseServiceAccount = await FirebaseModel.findOne({ type: "service_account" });

  if (!foundUser) {
    await User.create(config.ADMIN_USER)
  }

  // server start
  app.listen(config.PORT, async () => {
    console.log(`Server Start at ${config.PORT_URL}`)
  })
})


