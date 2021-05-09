import mongoose from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId
const BalanceSchema = new mongoose.Schema(
  {
    partyId: {
      type: ObjectId,
      required: true,
      ref:'Party'
    },
    userId: {
      type: ObjectId,
      required: true,
      ref:'User',
    },
    entryDate:{
      type: Date,
    },
    billDate:{
      type: Date,
    },
    billAmount: {
      type: Number,
      default:0,
    },
    paidAmount: {
      type: Number,
      default:0,
    },
    paidDate:{
      type: Date,
    },
    remainAmount: {
      type: Number,
      default:0,
    },
    alloyAmount: {
      type: Number,
      default:0,
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
  { timestamps: true, strict: false }
)

const Balance = mongoose.model("Balance", BalanceSchema)
export default Balance
