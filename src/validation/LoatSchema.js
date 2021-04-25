import { errorRes, successMessage } from "../functions/helper"

const checkAddLoatInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // loatWeight
    if (Array.isArray(keys) && !keys.includes("loatWeight")) {
      resolve(errorRes("Please Enter A loatWeight"))
    }

    // partyId
    if (Array.isArray(keys) && !keys.includes("partyId")) {
      resolve(errorRes("Please Enter A partyId"))
    }

    // loatPrice
    if (Array.isArray(keys) && !keys.includes("loatPrice")) {
      resolve(errorRes("Please Enter A loatPrice"))
    }

    // numOfDimonds
    if (Array.isArray(keys) && !keys.includes("numOfDimonds")) {
      resolve(errorRes("Please Enter A numOfDimonds"))
    }

    // cuttingType
    if (Array.isArray(keys) && !keys.includes("cuttingType")) {
      resolve(errorRes("Please Enter A cuttingType"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdateLoatInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)
    // partyId
    // if (Array.isArray(keys) && !keys.includes("partyId") || req.partyId == "") {
    //   resolve(errorRes("Please Enter party Id"))
    // }

    // loatId
    if (Array.isArray(keys) && !keys.includes("loatId") || req.loatId == "") {
      resolve(errorRes("Please Enter loat Id"))
    }

    // loatWeight
    if (Array.isArray(keys) && keys.includes("loatWeight") && req.loatWeight == "") {
      resolve(errorRes("Please Enter A loat Weight"))
    }

    // loatPrice
    if (Array.isArray(keys) && keys.includes("loatPrice") && req.loatPrice == "") {
      resolve(errorRes("Please Enter A loat Price"))
    }

    // numOfDimonds
    if (Array.isArray(keys) && keys.includes("numOfDimonds") && req.numOfDimonds == "") {
      resolve(errorRes("Please Enter A number Of Dimonds"))
    }

    // cuttingType
    if (Array.isArray(keys) && keys.includes("cuttingType") && req.cuttingType == "") {
      resolve(errorRes("Please Enter A cutting Type"))
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

const LoatSchema = {
  checkUpdateLoatInputValidate,
  checkAddLoatInputValidate,
}

export default LoatSchema
