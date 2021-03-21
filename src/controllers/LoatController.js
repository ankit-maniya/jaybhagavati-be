import { uploadFileToStorage } from "../functions/uploadfile"
import { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import LoatSchema from "../validation/LoatSchema"

const getLoat = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const { page, limit } = req.query
    const options = {
      page: page || 1,
      limit: limit || 10,
      populate: 'partyId',
    };

    let loat = await model.Loat.paginate({}, options)

    res.send(successRes(loat)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addLoat = async (req, res, next) => {
  try {

    const bodyData = req.body

    const isValidate = await LoatSchema.checkAddLoatInputValidate(bodyData) // validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    let loatData = await model.Loat.create(bodyData) // add loat bodyData

    res.send(successRes(loatData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateLoat = async (req, res, next) => {
  try {
    console.log("cLLED000----");
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

    console.log('updateData', updateData);

    const loat = await model.Loat.findByIdAndUpdate(
      // update loat bodyData and get latest bodyData
      { _id: updateData.loatId, partyId: updateData.partyId },
      {
        $set: updateData,
      },
      { new: true }
    )

    res.send(successRes(loat)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const LoatController = {
  getLoat,
  addLoat,
  updateLoat,
}
