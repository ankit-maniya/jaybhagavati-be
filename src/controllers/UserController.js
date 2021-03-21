import { uploadFileToStorage } from "../functions/uploadfile"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import Userschema from "../validation/UserSchema"
import { createToken } from "../functions/auth"
import { validatePassword } from "../models/User"

const login = async (req, res, next) => {
  try {
    const bodyData = req.body
    const isValidate = await Userschema.checkLoginInputValidate(bodyData) //validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    let find
    if(bodyData.mobile) {
      find = { mobile: bodyData.mobile }
    } else {
      find = { email: bodyData.email }
    }

    const iUser = await model.User.findOne(find)

    if (!iUser) throw { message: "Not Valid User" }
    const iMatchPassword = await validatePassword(
      bodyData.password,
      iUser.password
    ) //check password match or not

    if (!iMatchPassword) throw { message: "Invalid Password !!" }
    iUser.authToken = await createToken(iUser, "12h") // create authtoken

    res.send(successRes(iUser)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const signUp = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer
    const bodyData = req.body
    if (req.body.address) {
      bodyData.address = JSON.parse(req.body.address) // address is json stringyfied
    }
    const isValidate = await Userschema.checkSignupInputValidate(bodyData) // validate a key and value
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
    let userData = await model.User.create(bodyData) // add user bodyData
    if (req.files && req.files.profile) {
      // move file from TEMP location
      await helper.moveFile(userData.profile, userData._id, "USER")
    }
    userData.authToken = await createToken(userData, "12h") // create authtoken
    res.send(successRes(userData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateUser = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer as a middle ware
    const { _id, profile } = req.user // login user bodyData
    const updateData = JSON.parse(JSON.stringify(req.body)) // remove unusual [obj]
    // update edited time
    bodyData["updatedAt"] = new Date()
    const isValidate = await Userschema.checkUpdateUserInputValidate(
      updateData,
      _id
    ) // validate a key and value
    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        helper.removeFile(req.files.profile[0].filename, "TEMP")
      }
      throw { message: isValidate.message }
    }

    // add address with push old address (combine)
    if (updateData["address"]) {
      Array.prototype.push.apply(updateData["address"], address)
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      updateData["profile"] = req.files.profile[0].filename
      await helper.moveFile(updateData["profile"], _id, "USER") //move latest file role wise
      if (profile) {
        //delete old file
        helper.removeFile(profile, "USER", _id)
      }
    }
    const user = await model.User.findByIdAndUpdate(
      // update user bodyData and get latest bodyData
      {
        _id: _id,
      },
      {
        $set: updateData,
      },
      { new: true }
    )
    res.send(successRes(user)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const UserController = {
  login,
  signUp,
  updateUser,
}
