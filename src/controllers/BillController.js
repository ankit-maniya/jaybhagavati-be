import mongoose from "mongoose"
import { errorRes, successRes } from "../functions/helper.js"
import { model } from "../models/index.js"
const ObjectId = mongoose.Types.ObjectId

const getBill = async (req, res, next) => {
  try {
    const { partyId } = req.params
    const { _id } = req.user // login user bodyData

    if (!partyId) {
        throw { message: "PartyId is Require" }
    }

    let loats = await model.Loat.aggregate(
      [
        {
            $match:{ $and: [{ userId: _id }, { partyId: new ObjectId(partyId) }, { isDelete: false }] }
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
                "partyId":"$parties._id",
                "cuttingType": "$parties.cuttingType",
            }
        }
    ])

    let partyDetail = await model.Party.findOne({ _id: new ObjectId(partyId) })
    let paymentVariables = {
      TotalPayment: 0
    }
    
    partyDetail = partyDetail.cuttingType || [] 

    partyDetail.map((type) => {
      if (type.multiWithDiamonds) {
        paymentVariables[`Total${type.cutType}Diamonds`] = 0
        paymentVariables[`Total${type.cutType}DiamondsWisePrice`] = 0
      } else {
        paymentVariables[`Total${type.cutType}Price`] = 0
      }
    })

    let foundIndex
    if (loats && loats.length > 0) {
      for (const loat in loats) {

        if (loats[loat].cuttingType)
          foundIndex = await loats[loat].cuttingType.findIndex((d) => d.cutType === loats[loat].type)
          
        if (foundIndex !== -1) {
          const cutType = loats[loat].cuttingType[foundIndex].cutType
          
          if (loats[loat].cuttingType[foundIndex].multiWithDiamonds === true) {
            loats[loat].price = loats[loat].cuttingType[foundIndex].price
            loats[loat].payment = loats[loat].numOfDimonds * loats[loat].cuttingType[foundIndex].price
            
            paymentVariables[`Total${cutType}Diamonds`] += loats[loat].numOfDimonds
            paymentVariables[`Total${cutType}DiamondsWisePrice`] += loats[loat].payment
            paymentVariables.TotalPayment += loats[loat].payment
          } else {
            loats[loat].price = loats[loat].cuttingType[foundIndex].price
            loats[loat].payment = loats[loat].loatWeight * loats[loat].cuttingType[foundIndex].price
            
            paymentVariables[`Total${cutType}Price`] += loats[loat].payment
            paymentVariables.TotalPayment += loats[loat].payment
          }
        }

      }
    }

    const payment = { loats, paymentVariables}
    res.send(successRes(payment)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addBill = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const bodyData = req.body

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
