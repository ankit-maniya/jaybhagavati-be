import moment from "moment"
import helper, { errorRes, successMessage, successRes } from "../functions/helper"
import { model } from "../models"
import LoatSchema from "../validation/LoatSchema"

const getLoat = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const { page, limit } = req.query
    const { partyId } = req.params
    let query = {
      isDelete: false,
    }
    const options = {
      page: page || 1,
      limit: limit || 400000,
      populate: 'partyId',
      sort: {createdAt : 1}
    }

    if (partyId) {
      query['partyId'] = partyId
    }

    query['userId'] = _id

    let loat = await model.Loat.paginate(query, options)

    res.send(successRes(loat)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addLoat = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    let {loats} = req.body
    if(loats && !loats.length){
      throw { message: 'Invalid Data passed'}
    }

    let bodyData = []
    loats = JSON.parse(loats)
    const totalLength = loats.length;

    for (let i=0; i<totalLength; i++) {
      loats[i].userId = _id
      if(!loats[i].cutId) {
      }
      
      if (!loats[i].entryDate) {
        loats[i].entryDate = await helper.formatDate(new Date())
        loats[i].month = await helper.getMonth(new Date())
        loats[i].year = await helper.getYear(new Date())
        bodyData.push(loats[i])
      } else {
        const date = loats[i].entryDate
        loats[i].entryDate = await helper.formatDate(loats[i].entryDate)
        loats[i].month = await helper.getMonth(date) + 1
        loats[i].year = await helper.getYear(date)
        bodyData.push(loats[i])
      }
    }

    // const isValidate = await LoatSchema.checkAddLoatInputValidate(bodyData) // validate a key and value

    // if (isValidate.statuscode != 1) {
    //   throw { message: isValidate.message }
    // }

    let loatData = await model.Loat.create(bodyData) // add loat bodyData

    res.send(successRes(loatData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateLoat = async (req, res, next) => {
  try {

    const { _id } = req.user // login user bodyData
    const updateData = req.body
    const partyId = updateData.partyId || ""

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await LoatSchema.checkUpdateLoatInputValidate(
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

    const loat = await model.Loat.findByIdAndUpdate(
      // update loat bodyData and get latest bodyData
      { _id: updateData.loatId },
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

const deleteMany = async (req, res, next) => {
  try {

    const { _id } = req.user // login user bodyData
    let { deleteMany } = req.body

    if(deleteMany && deleteMany.length === 0) {
        throw { message: 'Invalid array Data passed'}
    }
  
    await model.Loat.updateMany(
      // update loat bodyData and get latest bodyData
      { _id: { $in: deleteMany }, userId:_id },
      {
        $set: { isDelete: true },
      },
      { new: true }
    )

    res.send(successMessage("deleted successfully data")) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


export const LoatController = {
  getLoat,
  addLoat,
  updateLoat,
  deleteMany,
}
