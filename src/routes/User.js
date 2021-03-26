import express from "express"
import { UserController } from "../controllers/UserController"
import { me } from "../functions/auth"

const User = express.Router()

User.post("/login", UserController.login)
User.post("/", UserController.signUp)
User.get("/email-send/:emailId", UserController.emailSend)
User.patch("/", me, UserController.updateUser)

export default User
