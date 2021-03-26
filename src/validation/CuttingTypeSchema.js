import { errorRes, successMessage } from "../functions/helper"

const checkAddCuttingTypeInputValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req)

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

        if (cutType == "" || price == "" )
          resolve(errorRes("Please Enter a Cutting Type"))
      })
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

    // cuttingType
    if (Array.isArray(keys) && keys.includes("cuttingType") && req.cuttingType == []) {
      resolve(errorRes("Please Enter A Cutting Type And It will be Array"))
    } else {
      if (keys.includes("cuttingType") && req.cuttingType != []) {

        req.cuttingType.map((cuttType) => {

          const cutType = cuttType.cutType
          const price = cuttType.price

          if (cutType == "" || price == "" )
            resolve(errorRes("Please Enter a Cutting Type"))
        })
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

const CuttingTypeSchema = {
  checkUpdateCuttingTypeInputValidate,
  checkAddCuttingTypeInputValidate,
}

export default CuttingTypeSchema
