import { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import LoatSchema from "../validation/LoatSchema"
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId;
const getBill = async (req, res, next) => {
  try {
    const { partyId } = req.params
    const { _id } = req.user // login user bodyData
    const { page, limit } = req.query
    if (!partyId) {
        throw { message: "PartyId is Require" }
    }
    const options = {
      page: page || 1,
      limit: limit || 10,
      populate: 'partyId',
    };

    let loats = await model.Loat.aggregate(
      [
        {
                $match:{ $or: [{ userId: _id }, {partyId: ObjectId(partyId)}] }
        },
        {
            $unwind: '$partyId'
        },
        {
            $lookup: {
                from: "parties",
                localField: "partyId",
                foreignField: "_id",
                as: "parties"
            },
        },
        {
            $unwind: "$parties"
        },
        {
            $project: {
                "_id": "$_id",
                "userId":"$userId",
                "type":"$cuttingType",
                "loatWeight":"$loatWeight",
                "numOfDimonds":"$numOfDimonds",
                "isDelete":"$isDelete",
                "isActive":"$isActive",
                "cuttingType": "$parties.cuttingType",
            }
        }
    ])

    let foundIndex;
    if (loats && loats.length > 0) {
      console.log("called with");
      for(const loat in loats) {
        if (loats[loat].cuttingType)
        console.log(loats[loat].cuttingType);
          foundIndex = await loats[loat].cuttingType.findIndex((d) => d.cutType === loats[loat].type)
          
          if(foundIndex !== -1){
            if( loats[loat].cuttingType[foundIndex].cutType === "newlessor") {
              loats[loat].payment = loats[loat].numOfDimonds * loats[loat].cuttingType[foundIndex].price
            } else {
              loats[loat].payment = loats[loat].loatWeight * loats[loat].cuttingType[foundIndex].price
            }
          }
        }
      }

    res.send(successRes(loats)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addBill = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const bodyData = req.body

    const isValidate = await LoatSchema.checkAddLoatInputValidate(bodyData) // validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    let loatData = await model.Bill.create({ ...bodyData, userId: _id }) // add loat bodyData

    res.send(successRes(loatData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateBill = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const updateData = req.body
    
    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await LoatSchema.checkUpdateLoatInputValidate(
      updateData,
      _id
    )

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    const loat = await model.Bill.findByIdAndUpdate(
      // update loat bodyData and get latest bodyData
      { _id: updateData.loatId, partyId: updateData.partyId },
      {
        $set: { ...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(loat)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const BillController = {
  getBill,
  addBill,
  updateBill,
}
