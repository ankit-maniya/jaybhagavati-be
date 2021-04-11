import mongoose from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId
const BalanceSchema = new mongoose.Schema(
  {
    partyId: {
      type: ObjectId,
      ref:'Party'
    },
    userId: {
      type: ObjectId,
      required: true,
      ref:'User',
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    balanceType: {
      type: String,
      default: "ADD",
      enum: ["ADD", "DEDUCT", "REMAIN"]
    },
    entryDate:{
      type: Date,
    },
    isCovered: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
)

const Balance = mongoose.model("Balance", BalanceSchema)
export default Balance
