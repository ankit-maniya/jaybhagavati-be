import moment from "moment"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import BalanceSchema from "../validation/BalanceSchema"

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

    let balance = await model.Balance.find(query).populate('partyId')

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

    if (bodyData.entryDate) {
      bodyData.entryDate = await helper.formatDate(bodyData.entryDate)
    } else {
      bodyData.entryDate = await helper.formatDate(new Date())
    }

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
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
  updateBalance
}
