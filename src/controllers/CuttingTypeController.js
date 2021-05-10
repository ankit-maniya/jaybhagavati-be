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

    console.log('bodyData', bodyData);

    const isValidate = await CuttingTypeSchema.checkAddCuttingTypeInputValidate(bodyData) // validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    // if(bodyData.cutType !== "") {
    //   const typeExist = await model.CuttingType.findOne({ userId: _id, cutType: bodyData.cutType })
    //   if (typeExist) {
    //     throw { message : `${typeExist.cutType} Cutting Type is Already Exists` }
    //   }
    // }

    let getCuttingData = await model.CuttingType.create({...bodyData, userId: _id}) // add CuttingType bodyData

    res.send(successRes(getCuttingData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateCuttingType = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const updateData = req.body

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await CuttingTypeSchema.checkUpdateCuttingTypeInputValidate(
      updateData,
      _id
    )

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }
    
    // if(updateData.cutType !== "") {
    //   const typeExist = await model.CuttingType.findOne({ _id: updateData.cutTypeId, cutType: updateData.cutType })
    //   if (typeExist) {
    //     throw { message : `${typeExist.cutType} Cutting Type is Already Exists` }
    //   }
    // }

    const CuttingType = await model.CuttingType.findByIdAndUpdate(
      // update CuttingType bodyData and get latest bodyData
      {
        _id: updateData.cutTypeId,
      },
      {
        $set: {...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(CuttingType)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const CuttingTypeController = {
  getCuttingType,
  addCuttingType,
  updateCuttingType,
}
