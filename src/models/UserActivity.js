import mongoose from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId
const UserActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref:'User',
    },
    otp: {
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
  },
  { timestamps: true }
)

const UserActivity = mongoose.model("UserActivity", UserActivitySchema)
export default UserActivity
