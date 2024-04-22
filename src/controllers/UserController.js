import { uploadFileToStorage } from "../functions/uploadfile.js"
import helper, { errorRes, successRes } from "../functions/helper.js"
import { model } from "../models/index.js"
import Userschema from "../validation/UserSchema.js"
import { createToken } from "../functions/auth.js"
import { validatePassword } from "../models/User.js"
import forgotPasswordByMail from "../functions/sendMail.js"

const login = async (req, res, next) => {
  try {
    const bodyData = req.body
    const isValidate = await Userschema.checkLoginInputValidate(bodyData) //validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    let find
    let iUser
    if(bodyData.username) {
      find = { mobile: bodyData.username }
      iUser = await model.User.findOne(find)
    }

    if (!iUser) {
      find = { email: bodyData.username }
      iUser = await model.User.findOne(find)
    }

    if (!iUser) throw { message: "Not Valid User" }
    const iMatchPassword = await validatePassword(
      bodyData.password,
      iUser.password
    ) //check password match or not

    if (!iMatchPassword) throw { message: "Invalid Password !!" }
    iUser.authToken = await createToken(iUser, "7d") // create authtoken
    delete iUser.password
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
    userData.authToken = await createToken(userData, "7d") // create authtoken
    res.send(successRes(userData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateUser = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer as a middle ware
    const { _id, profile } = req.user // login user bodyData
    const updateData = req.body // remove unusual [obj]
    // update edited time
    updateData["updatedAt"] = new Date()
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

const emailSend = async (req, res, next) => {
  try {
    const { emailId } = req.params
    const isValidate = await Userschema.checkEmailInputValidate(emailId) //validate a key and value

    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message }
    }

    const user = await model.User.findOne({ email: emailId })
    const Otp = await helper.getRandomNumber()

    const insertData = {
      userId:user._id,
      otp:Otp
    }
    await model.UserActivity.create(insertData)

    let emailSend
    if(Otp) {
      emailSend = await forgotPasswordByMail(emailId, Otp)
    }

    if (emailSend) {
      res.send(successRes(emailSend)) // get success response
    }
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const UserController = {
  login,
  signUp,
  updateUser,
  emailSend,
}
