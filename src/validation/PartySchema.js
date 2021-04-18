import { isEmail } from "validator"
import { model } from "../models"
import { errorRes, successMessage } from "../functions/helper"

const checkAddPartyInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)
    // name
    if (Array.isArray(keys) && !keys.includes("name")) {
      resolve(errorRes("Please Enter A Name"))
    }
    // billing Name
    if (Array.isArray(keys) && !keys.includes("billingName")) {
      resolve(errorRes("Please Enter A billingName"))
    }

    // openingBalance
    if (Array.isArray(keys) && keys.includes("openingBalance") && req.openingBalance == "") {
      resolve(errorRes("Please Enter A openingBalance"))
    }

    // emailid
    if ((Array.isArray(keys) && keys.includes("email")) || req.email == "") {
      resolve(errorRes("Please Enter Email"))
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve(errorRes("Please Enter Proper Email"))
      } else if(keys.includes("email")){
        const found = await model.Party.findOne({ email: req.email })
        if (found) {
          if(found.isDelete){
            resolve(errorRes({msg:"Email is Alredy Register! Use Diffrent Email!",partyId:found._id}))
            return
          }
          resolve(errorRes({msg:"Email is Alredy Register! Use Diffrent Email!",partyId:''}))
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
        const found = await model.Party.findOne({ mobile: req.mobile })
        if (found) {
          if(found.isDelete){
            resolve(errorRes({msg:"Mobile is Alredy Register! Use Diffrent Mobile!",partyId:found._id}))
            return
          }
          resolve(errorRes({msg:"Mobile is Alredy Register! Use Diffrent Mobile!",partyId:''}))
        }
      }
    }
    // cuttingType
    if (
      (Array.isArray(keys) && !keys.includes("cuttingType")) ||
      req.cuttingType == []
    ) {
      resolve(
        errorRes("Please Enter A Cutting Type And It will be Array of Object")
      )
    } else {
      req.cuttingType.map((cuttType) => {

        const cutType = cuttType.cutType
        const price = cuttType.price
        const typeId = cuttType.typeId

        if (cutType == "" || price == "" || typeId == "")
          resolve(errorRes("Please Enter a Cutting Type"))
      })
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdatePartyInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // partyId
    if (Array.isArray(keys) && !keys.includes("partyId") && req.partyId == "") {
      resolve(errorRes("Please Enter party Id"))
    }

    // billing Name
    if (Array.isArray(keys) && keys.includes("billingName") && req.billingName == "") {
      resolve(errorRes("Please Enter A billingName"))
    }

    // name
    if (Array.isArray(keys) && keys.includes("name") && req.name == "") {
      resolve(errorRes("Please Enter A Name"))
    }

    // openingBalance
    if (Array.isArray(keys) && keys.includes("openingBalance") && req.openingBalance == "") {
      resolve(errorRes("Please Enter A openingBalance"))
    }

     // name
    if (Array.isArray(keys) && keys.includes("billingName") && req.billingName == "") {
      resolve(errorRes("Please Enter A billingName"))
    }

    // // cuttingType
    // if (Array.isArray(keys) && keys.includes("cuttingType") && req.cuttingType == []) {
    //   resolve(errorRes("Please Enter A Cutting Type And It will be Array"))
    // } else {
    //   if (keys.includes("cuttingType") && req.cuttingType != []) {

    //     req.cuttingType.map((cuttType) => {

    //       const cutType = cuttType.cutType
    //       const price = cuttType.price

    //       if (cutType == "" || price == "" )
    //         resolve(errorRes("Please Enter a Cutting Type"))
    //     })
    //   }
    // }

    // mobile
    if (Array.isArray(keys) && keys.includes("mobile") && req.mobile == "") {
      resolve(errorRes("Please Enter Mobile"))
    } else {
      if (keys.includes("mobile") && req.mobile != "") {
        if (!checkMobile(req.mobile)) {
          resolve(errorRes("Please Enter Valid Mobile"))
        }
      }
    }

    // optional emailid
    if (Array.isArray(keys) && keys.includes("email") && req.email == "") {
      resolve(errorRes("Please Enter Email"))
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve(errorRes("Please Enter Proper Email"))
      }
    }

    // // isActive
    // if (
    //   Array.isArray(keys) &&
    //   keys.includes("isActive") &&
    //   ![0, 1].includes(req.isActive)
    // ) {
    //   resolve(errorRes("Please Enter isActive type!"))
    // }

    // // isDelete
    // if (
    //   Array.isArray(keys) &&
    //   keys.includes("isDelete") &&
    //   ![0, 1].includes(req.isDelete)
    // ) {
    //   resolve(errorRes("Please Enter Proper isDelete type!"))
    // }

    resolve(successMessage("valid data"))
  })
}

const checkMobile = (data) => {
  if (data.length < 10 && 13 > data.length) return false
  return true
}

const Partyschema = {
  checkUpdatePartyInputValidate,
  checkAddPartyInputValidate,
}

export default Partyschema
