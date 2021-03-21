import mongoose from "mongoose"
const ObjectId = mongoose.Schema.Types.ObjectId
const AddressSchema = new mongoose.Schema({
  address: {
    type: [
      {
        latitude: String,
        longitude: String,
      },
    ],
    required: true,
  },
})

const Address = mongoose.model("address", AddressSchema)

export default Address
