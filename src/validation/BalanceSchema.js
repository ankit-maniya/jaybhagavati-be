import { errorRes, successMessage } from "../functions/helper.js"

const checkAddBalanceInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // partyId
    if (Array.isArray(keys) && !keys.includes("partyId")) {
      resolve(errorRes("Please Enter A partyId"))
    }

    // billDate
    if (Array.isArray(keys) && !keys.includes("billDate")) {
      resolve(errorRes("Please Enter A billDate"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdateBalanceInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // balanceId
    if (Array.isArray(keys) && !keys.includes("balanceId") || req.balanceId == "") {
      resolve(errorRes("Please Enter Balance Id"))
    }
    
    // billDate
    if (Array.isArray(keys) && keys.includes("billDate") && req.billDate == "") {
      resolve(errorRes("Please Enter billDate"))
    }
    
    // billAmount
    if (Array.isArray(keys) && keys.includes("billAmount") && req.billAmount == "") {
      resolve(errorRes("Please Enter billAmount"))
    }

    // paidAmount
    if (Array.isArray(keys) && keys.includes("paidAmount") && req.paidAmount == "") {
      resolve(errorRes("Please Enter paidAmount"))
    }

    // paidDate
    if (Array.isArray(keys) && keys.includes("paidDate") && req.paidDate == "") {
      resolve(errorRes("Please Enter paidDate"))
    }

    resolve(successMessage("valid data"))
  })
}

const BalanceSchema = {
  checkUpdateBalanceInputValidate,
  checkAddBalanceInputValidate,
}

export default BalanceSchema
