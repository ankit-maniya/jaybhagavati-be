import User from "./User"
import Party from "./Party"
import Loat from "./Loat"
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
  Loat
}
