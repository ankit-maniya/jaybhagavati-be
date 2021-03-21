import express from "express"
import { UserController } from "../controllers/UserController"
import { me } from "../functions/auth"

const User = express.Router()

User.get("/", UserController.login)
User.post("/", UserController.signUp)
User.patch("/", me, UserController.updateUser)

export default User
