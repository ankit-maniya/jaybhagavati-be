import { config } from "../configs/config"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { model } from "../models"
import { errorRes } from "./helper"

export const me = async (req, res, next) => {
  try {
    if (!req.headers["x-token"]) throw "token is required"
    const user = await verifyAuthTocken(req.headers["x-token"])
    // provide user data to access all route
    if (user.role) {
      req.user = user
    }
    next()
  } catch (error) {
    res.send(errorRes(error.message,2))
  }
}

export const createToken = async (data, expire) => {
  const { mobile, name, _id, role } = data
  const authToken = await jwt.sign(
    { mobile, name, _id, role },
    config.JWT_SECRET,
    {
      expiresIn: expire,
    }
  )
  return authToken
}

export const verifyAuthTocken = async (xtoken) => {
    const token = await jwt.verify(xtoken, config.JWT_SECRET)
    const id = mongoose.Types.ObjectId(token._id)
    let udata = ""
    if (token) {
      udata = await model.User.findOne({
        _id: id,
      })
    }
    if (!udata) throw "Your Session Expired! Login Now!!"
    if (udata && udata.isActive == false) throw "Your Account is Locked By Admin"
    return udata
}
