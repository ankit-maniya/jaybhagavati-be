import { isEmail } from "validator"
import { model } from "../models"
import { errorRes, successMessage } from "../functions/helper"

const checkSignupInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)
    // name
    if (Array.isArray(keys) && !keys.includes("name")) {
      resolve(errorRes("Please Enter A Name"))
    }
    // emailid
    if ((Array.isArray(keys) && !keys.includes("email")) || req.email == "") {
      resolve(errorRes("Please Enter Email"))
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve(errorRes("Please Enter Proper Email"))
      } else if (keys.includes("email")) {
        const found = await model.User.findOne({ email: req.email })
        if (found) {
          resolve(errorRes("Email is Alredy Register! Use Diffrent Email!"))
        }
      }
    }
    // mobile
    if ((Array.isArray(keys) && !keys.includes("mobile")) || req.mobile == "") {
      resolve(errorRes("Please Enter Mobile"))
    } else {
      if (!checkMobile(req.mobile)) {
        resolve(errorRes("Please Enter Valid Mobile"))
      } else {
        const found = await model.User.findOne({ mobile: req.mobile })
        if (found) {
          resolve(errorRes("Mobile is Alredy Register! Use Diffrent Mobile!"))
        }
      }
    }
    // address
    if (
      (Array.isArray(keys) && keys.includes("address")) ||
      req.address == []
    ) {
      resolve(
        errorRes("Please Enter A Address And It will be Array of Object")
      )
    } else {
      if (keys.includes("address") && req.address != []) {
        req.address.map((addr) => {
          const latitude = addr.latitude
          const longitude = addr.longitude
          if (latitude == "" && longitude == "")
            resolve(errorRes("Please Enter a Address"))
          })
      }
    }
    // password & repassword
    if (
      (Array.isArray(keys) && !keys.includes("password")) ||
      req.password == ""
    ) {
      resolve(errorRes("Please Enter password"))
    } else {
      if (req.password != "") {
        const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
        if (!regx.test(req.password)) {
          resolve(
            errorRes(
              "Warning Password Contain at least 1 special character,1 uppercase letter,1 lowercase letter,1 numeric character And 8 characters!! Ex:Test@123"
            )
          )
        }
      }
      if (
        (Array.isArray(keys) && !keys.includes("repassword")) ||
        req.repassword == ""
      )
        resolve(errorRes("Please Enter password"))
      else {
        if (keys.includes("repassword") && req.repassword !== req.password)
          resolve(errorRes("password && repassword! Both Password Not Match"))
      }
    }
    resolve(successMessage("valid data"))
  })
}

const checkLoginInputValidate = async (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // Username
    if ((Array.isArray(keys) && !keys.includes("username")) && req.username == "") {
        resolve(errorRes("Please Enter Username"))
    }

    // password & repassword
    if (
      (Array.isArray(keys) && !keys.includes("password")) ||
      req.password == ""
    ) {
      resolve(errorRes("Please Enter password"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdateUserInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)
    // name
    if (Array.isArray(keys) && keys.includes("name") && req.name == "") {
      resolve(errorRes("Please Enter A Name"))
    }
    // address
    if (Array.isArray(keys) && keys.includes("address") && req.address == []) {
      resolve(errorRes("Please Enter A Address And It will be Array"))
    } else {
      if (keys.includes("address") && req.address != []) {
        req.address.map((addr) => {
          const latitude = addr.latitude
          const longitude = addr.longitude
          if (latitude == "" && longitude == "")
            resolve(errorRes("Please Enter a Address"))
          })
      }
    }

    // mobile
    if (Array.isArray(keys) && keys.includes("mobile") && req.mobile == "") {
      resolve(errorRes("Please Enter Mobile"))
    } else {
      if (keys.includes("mobile") && req.mobile != "") {
        if (!checkMobile(req.mobile)) {
          resolve(errorRes("Please Enter Valid Mobile"))
        } else {
          const found = await model.User.findOne({ mobile: req.mobile })
          if (found && JSON.stringify(found._id) != JSON.stringify(LoginId)) {
            resolve(
              errorRes("Mobile is Alredy Register! Use Diffrent Mobile!")
            )
          }
        }
      }
    }

    // password & repassword
    if (
      Array.isArray(keys) &&
      keys.includes("password") &&
      req.password == ""
    ) {
      resolve(errorRes("Please Enter password"))
    } else {
      if (keys.includes("password") && req.password != "") {
        const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
        if (!regx.test(req.password)) {
          resolve(
            errorRes(
              "Warning Password Contain at least 1 special character,1 uppercase letter,1 lowercase letter,1 numeric character And 8 characters!! Ex:Test@123"
            )
          )
        }
        if (
          (Array.isArray(keys) && !keys.includes("repassword")) ||
          req.repassword == ""
        )
          resolve(errorRes("Please Enter password"))
        else {
          if (keys.includes("repassword") && req.repassword !== req.password)
            resolve(
              errorRes("password && repassword! Both Password Not Match")
            )
        }
      }
    }

    // optional emailid
    if (Array.isArray(keys) && keys.includes("email") && req.email == "") {
      resolve(errorRes("Please Enter Email"))
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve(errorRes("Please Enter Proper Email"))
      } else if (keys.includes("email") && req.email != "") {
        const found = await model.User.findOne({ email: req.email })
        if (found && JSON.stringify(found._id) != JSON.stringify(LoginId)) {
          resolve(errorRes("Email is Alredy Register! Use Diffrent Email!"))
        }
      }
    }

    // isActive
    if (
      Array.isArray(keys) &&
      keys.includes("isActive") &&
      ![0, 1].includes(req.isActive)
    ) {
      resolve(errorRes("Please Enter isActive type!"))
    }

    // isDelete
    if (
      Array.isArray(keys) &&
      keys.includes("isDelete") &&
      ![0, 1].includes(req.isDelete)
    ) {
      resolve(errorRes("Please Enter Proper isDelete type!"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkMobile = (data) => {
  if (data.length < 10 && 13 > data.length) return false
  return true
}

const Userschema = {
  checkLoginInputValidate,
  checkUpdateUserInputValidate,
  checkSignupInputValidate,
}

export default Userschema
