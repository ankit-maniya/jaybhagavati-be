import mongoose from "mongoose"
const mongoosePaginate = require('mongoose-paginate-v2')

const ObjectId = mongoose.Schema.Types.ObjectId
const LoatSchema = new mongoose.Schema(
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
    cutId: {
      type: ObjectId,
      required: true,
    },
    typeId: {
      type: ObjectId,
    },
    loatWeight: {
      type: Number,
      required: true,
    },
    loatPrice: {
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
    multiWithDiamonds:  { 
      type: Boolean,
      default: false
    },
    month: { 
      type: Number,
    },
    year: { 
      type: Number,
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
    entryDate:{
      type: Date,
    }
  },
  { timestamps: true, strict: false }
)

LoatSchema.plugin(mongoosePaginate)

const Loat = mongoose.model("Loat", LoatSchema)
export default Loat
