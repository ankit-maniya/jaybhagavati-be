import mongoose from "mongoose"
import { isEmail } from "validator"

const ObjectId = mongoose.Schema.Types.ObjectId
const PartySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
    },
    userId: {
      type: String,
      required: true,
      ref:'User',
    },
    email: {
      type: String,
      validate: [isEmail, "Please Enter Valid Email!"],
    },
    cuttingType: {
      type: [
        {
          // _id:false,
          cuttype: String,
          price: Number,
        },
      ]
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
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
    }
  },
  { timestamps: true }
)

const Party = mongoose.model("Party", PartySchema)
export default Party
