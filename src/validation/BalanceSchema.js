import { errorRes, successMessage } from "../functions/helper"

const checkAddBalanceInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // partyId
    if (Array.isArray(keys) && !keys.includes("partyId")) {
      resolve(errorRes("Please Enter A partyId"))
    }

    // openingBalance
    if (Array.isArray(keys) && !keys.includes("openingBalance")) {
      resolve(errorRes("Please Enter A openingBalance"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdateBalanceInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)
    // partyId
    // if (Array.isArray(keys) && !keys.includes("partyId") || req.partyId == "") {
    //   resolve(errorRes("Please Enter party Id"))
    // }

    // balanceId
    if (Array.isArray(keys) && !keys.includes("balanceId") || req.balanceId == "") {
      resolve(errorRes("Please Enter Balance Id"))
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

const BalanceSchema = {
  checkUpdateBalanceInputValidate,
  checkAddBalanceInputValidate,
}

export default BalanceSchema
