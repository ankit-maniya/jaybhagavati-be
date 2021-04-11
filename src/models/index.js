import User from "./User"
import UserActivity from "./UserActivity"
import Party from "./Party"
import CuttingType from "./CuttingType"
import Loat from "./Loat"
import Bill from "./Bill"
import Balance from "./Balance"
import mongoose from "mongoose"
import { config } from "../../config"

const connectDB = async () => {
  return await mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export { connectDB }
export const model = {
  User,
  Party,
  CuttingType,
  Loat,
  Bill,
  Balance,
  UserActivity
}
