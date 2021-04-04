import { errorRes, successMessage } from "../functions/helper"

const checkAddCuttingTypeInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // cutType
    if (Array.isArray(keys) && !keys.includes("cutType") || req.cutType == "") {
      resolve(errorRes("Please Enter cutType"))
    }

    // price
    if (Array.isArray(keys) && !keys.includes("price") && req.price == "") {
      resolve(errorRes("Please Enter price"))
    }

    resolve(successMessage("valid data"))
  })
}

const checkUpdateCuttingTypeInputValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

    // cutTypeId
    if (Array.isArray(keys) && !keys.includes("cutTypeId") || req.cutTypeId == "") {
      resolve(errorRes("Please Enter cutTypeId  Id"))
    }

    // cutType
    if (Array.isArray(keys) && keys.includes("cutType") && req.cutType == "") {
      resolve(errorRes("Please Enter cutType"))
    }

    // price
    if (Array.isArray(keys) && keys.includes("price") && req.price == "") {
      resolve(errorRes("Please Enter price"))
    }


    // isActive
    // if (
    //   Array.isArray(keys) &&
    //   keys.includes("isActive") &&
    //   ![0, 1].includes(req.isActive)
    // ) {
    //   resolve(errorRes("Please Enter isActive type!"))
    // }

    // isDelete
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

const CuttingTypeSchema = {
  checkUpdateCuttingTypeInputValidate,
  checkAddCuttingTypeInputValidate,
}

export default CuttingTypeSchema
