import { uploadFileToStorage } from "../functions/uploadfile"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import Partyschema from "../validation/PartySchema"

const getParty = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const filter = { isDelete : false, userId: _id }

    let party = await model.Party.find(filter)

    res.send(successRes(party)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addParty = async (req, res, next) => {
  try {

    console.log('req', req.body);
    await uploadFileToStorage(req, res) // upload file using multer
    const { _id } = req.user // login user bodyData

    const bodyData = req.body

    if (req.body.cuttingType) {
      bodyData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    const isValidate = await Partyschema.checkAddPartyInputValidate(bodyData) // validate a key and value

    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        helper.removeFile(req.files.profile[0].filename, "TEMP")
      }
      throw { message: isValidate.message }
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      bodyData["profile"] = req.files.profile[0].filename
    }

    let partyData = await model.Party.create({...bodyData, userId: _id}) // add party bodyData

    if (req.files && req.files.profile) {
      // move file from TEMP location
      await helper.moveFile(partyData.profile, partyData._id, "PARTY")
    }

    res.send(successRes(partyData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateParty = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer as a middle ware

    const { _id } = req.user // login user bodyData
    const updateData = req.body
    
    if (req.body.cuttingType) {
      updateData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await Partyschema.checkUpdatePartyInputValidate(
      updateData,
      _id
    )

    const partyData = await model.Party.findOne({ _id: req.body.partyId })

    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        helper.removeFile(req.files.profile[0].filename, "TEMP")
      }
      throw { message: isValidate.message }
    }

    // add cuttingType with push old cuttingType (combine)
    if (updateData["cuttingType"]) {
      updateData["cuttingType"].map((cuttingData) => {
        if (cuttingData._id) {
          let getIndex = partyData.cuttingType.findIndex((d) => d.id === cuttingData._id)
          if (getIndex !== undefined && getIndex !== -1) {
            updateData["cuttingType"][getIndex] = cuttingData
          }
        }
      })
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      updateData["profile"] = req.files.profile[0].filename
      await helper.moveFile(updateData["profile"], updateData.partyId, "PARTY") //move latest file role wise

      if (profile) {
        //delete old file
        helper.removeFile(profile, "PARTY", updateData.partyId)
      }
    }

    const party = await model.Party.findByIdAndUpdate(
      // update party bodyData and get latest bodyData
      {
        _id: updateData.partyId,
      },
      {
        $set: {...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(party)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const PartyController = {
  getParty,
  addParty,
  updateParty,
}
