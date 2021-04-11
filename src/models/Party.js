import mongoose from "mongoose"
import { isEmail } from "validator"

const ObjectId = mongoose.Schema.Types.ObjectId
const PartySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    billingName: {
      type: String,
      required: true,
      unique:true,
    },
    // openingBalance: {
    //   type: Number,
    //   default: 0,
    // },
    balanceSheet: [{
        _id:false,
        oldBalance: {
          type:Number,
          default:0
        },
        date: {
          type:String,
        },
        deductionAmount: {
          type:Number,
          default:0
        },
        remainBalance: {
          type:Number,
          default:0
        },
        alloyAmount: {
          type:Number,
          default:0
        },
      }],
    userId: {
      type: ObjectId,
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
          cutType: {
            type:String,
            default:''
          },
          price: {
            type:Number,
            default:0
          },
          multiWithDiamonds: {
            type:Boolean,
            default:false
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
