import { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import CuttingTypeSchema from "../validation/CuttingTypeSchema"

const getCuttingType = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const filter = { isDelete : false, userId: _id }

    let CuttingType = await model.CuttingType.find(filter)

    res.send(successRes(CuttingType)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addCuttingType = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData

    const bodyData = req.body

    if (req.body.cuttingType) {
      bodyData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    const isValidate = await CuttingTypeSchema.checkAddCuttingTypeInputValidate(bodyData) // validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    let CuttingData = await model.CuttingType.create({...bodyData, userId: _id}) // add CuttingType bodyData

    res.send(successRes(CuttingData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }``
}

const updateCuttingType = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const updateData = req.body
    
    if (req.body.cuttingType) {
      updateData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await CuttingTypeSchema.checkUpdateCuttingTypeInputValidate(
      updateData,
      _id
    )

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }
    
    const CuttingData = await model.CuttingType.findOne({ _id: updateData.CuttingTypeId })

    // add cuttingType with push old cuttingType (combine)
    if (updateData["cuttingType"]) {
      updateData["cuttingType"].map((cuttingData) => {
        if (cuttingData._id) {
          let getIndex = CuttingData.cuttingType.findIndex((d) => d.id === cuttingData._id)
          if (getIndex !== undefined && getIndex !== -1) {
            updateData["cuttingType"][getIndex] = cuttingData
          }
        }
      })
    }

    const CuttingType = await model.CuttingType.findByIdAndUpdate(
      // update CuttingType bodyData and get latest bodyData
      {
        _id: updateData.CuttingTypeId,
      },
      {
        $set: {...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(CuttingType)) // get success response
  } catch (error) {
    console.log('error', error)
    res.send(errorRes(error.message)) // get error response
  }
}

export const CuttingTypeController = {
  getCuttingType,
  addCuttingType,
  updateCuttingType,
}
