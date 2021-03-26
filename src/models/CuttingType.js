import mongoose from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId
const CuttingTypeSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref:'User',
    },
    cuttingType: {
      type: [
        {
          // _id:false,
          cutType: String,
          price: Number,
          multiWithDiamonds: Boolean,
        },
      ],
      default: [
        {
          cutType: '',
          price: 0,
          multiWithDiamonds: false
        }
      ]
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

const CuttingType = mongoose.model("cuttingType", CuttingTypeSchema)
export default CuttingType
