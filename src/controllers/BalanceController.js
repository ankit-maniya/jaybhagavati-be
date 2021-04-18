import moment from "moment"
import mongoose from "mongoose"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import BalanceSchema from "../validation/BalanceSchema"

const ObjectId = mongoose.Types.ObjectId

const getBalance = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const { partyId } = req.params
    let query = {
      isDelete: false,
    }

    if (partyId) {
      query['partyId'] = partyId
    }

    query['userId'] = _id

    let balance = await model.Balance.find(query)

    res.send(successRes(balance)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const getBalancePartyWise = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const { partyId } = req.params

    if(!partyId) throw { message : `Please pass PartyId` }

    let balance = await model.Balance.aggregate([
      {
        $match :{ 
          $and:  [
              { partyId: ObjectId(partyId)},
              { userId: _id },
              { isDelete : false },
            ] 
        }
      },
      {
          '$lookup': {
              'from': 'parties',
              'localField': 'partyId',
              'foreignField': '_id',
              'as': 'party'
          }
      },
      {
        $group: {
            _id:"$billDate",
            details: {
              $push: {
                    balanceId:"$_id",
                    billAmount:"$billAmount",
                    paidAmount:"$paidAmount",
                    remainAmount:"$remainAmount",
                    alloyAmount:"$alloyAmount",
                    partyId:{ $first:"$party._id" },
                    name:{ $first:"$party.name" },
                    mobile:{ $first:"$party.mobile" }
                },
            },
            totalBillAmount: {
                $sum:"$billAmount"
            },
            totalPaidAmount: {
                $sum:"$paidAmount"
            },
            totalRemainAmount: {
                $sum:"$remainAmount"
            },
            totalAlloyAmount: {
                $sum:"$alloyAmount"
            }
        }
      },
      {
        $sort: { 
                _id: 1 
            },
      },
      {
        $group: {
            _id : { "month":{$month:"$_id"}, "year": {$year:"$_id"} },
            dayWiseDetails: {
              $push: "$$ROOT"
            },
            monthTotalBillAmount: { 
                $first:"$totalBillAmount" 
            },
            monthTotalPaidAmount: {
                $sum:"$totalPaidAmount"
            },
            monthTotalRemainAmount: {
                $last:"$totalRemainAmount"
            },
            monthTotalAlloyAmount: {
                $sum:"$totalAlloyAmount"
            }
        }
      },
      {
          $group : {
              _id : "$_id.year",
              yearWiseDetails: {
                  $push: "$$ROOT"
              },
              yearTotalBillAmount: {
                $sum:"$monthTotalBillAmount"
              },
              yearTotalPaidAmount: {
                $sum:"$monthTotalPaidAmount"
              },
              yearTotalRemainAmount: {
                $sum:"$monthTotalRemainAmount"
              },
              yearTotalAlloyAmount: {
                $sum:"$monthTotalAlloyAmount"
              }
          },
      },
  ])

    res.send(successRes(balance)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addBalance = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const bodyData = req.body
    const partyId = bodyData.partyId || ""

    const isValidate = await BalanceSchema.checkAddBalanceInputValidate(
      bodyData,
      _id
    )

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    // if()

    if (bodyData.entryDate) {
      bodyData.entryDate = await helper.formatDate(bodyData.entryDate)
    } else {
      bodyData.entryDate = await helper.formatDate(new Date())
    }

    if (bodyData.billDate) {
      bodyData.billDate = await helper.formatDate(bodyData.billDate)
    }

    let balanceData = await model.Balance.create({...bodyData, userId: _id}) // add balance bodyData

    res.send(successRes(balanceData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateBalance = async (req, res, next) => {
  try {

    const { _id } = req.user // login user bodyData
    const updateData = req.body
    const partyId = updateData.partyId || ""

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await BalanceSchema.checkUpdateBalanceInputValidate(
      updateData,
      _id
    )

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    if (partyId == '') {
      delete updateData.partyId
    }

    if (updateData.entryDate) {
      updateData.entryDate = moment(updateData.entryDate).format('YYYY-MM-DD')
    }

    const balance = await model.Balance.findByIdAndUpdate(
      // update balance bodyData and get latest bodyData
      { _id: updateData.balanceId },
      {
        $set: { ...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(balance)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


export const BalanceController = {
  getBalance,
  addBalance,
  updateBalance,
  getBalancePartyWise
}
