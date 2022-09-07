import mongoose from "mongoose"
import { isEmail } from "validator"
import bcrypt from "bcrypt"

const ObjectId = mongoose.Schema.Types.ObjectId
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: [
        {
          // _id:false,
          latitude: String,
          longitude: String,
        },
      ]
    },
    email: {
      type: String,
      validate: [isEmail, "Please Enter Valid Email!"],
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    isActive: {
        type: Boolean,
        default: 1,
        enum: [0, 1] //0 = not Active, 1 = Active
    },
    isDelete: {
        type: Boolean,
        default: 0,
        enum: [0, 1] //0 = Not Deleted, 1 = Deleted
    },
    authToken: {
      type: String,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
  },
  { timestamps: true, strict: false }
)

UserSchema.pre("save", async function () {
  this.password = await this.generatePasswordHash()
})

UserSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10
  return await bcrypt.hash(this.password, saltRounds)
}

export const validatePassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword)
}

const User = mongoose.model("User", UserSchema)
export default User
