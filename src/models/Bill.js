import mongoose from "mongoose"
const mongoosePaginate = require('mongoose-paginate-v2')

const ObjectId = mongoose.Schema.Types.ObjectId
const BillSchema = new mongoose.Schema(
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
    loatWeight: {
      type: Number,
      required: true,
    },
    numOfDimonds: {
      type: Number,
      required: true,
    },
    cuttingType:  { 
      type: String,
      required: true
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
  { timestamps: true, strict: false }
)

BillSchema.plugin(mongoosePaginate)

const Bill = mongoose.model("Bill", BillSchema)
export default Bill
