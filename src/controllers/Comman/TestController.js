import mongoose from "mongoose"
import helper, { errorRes, successRes } from "../../functions/helper"
import { model } from "../../models"
import moment from "moment"
import _ from "lodash"

const ObjectId = mongoose.Types.ObjectId

const updateFunction = async (req, res, next) => {
  const userId = ObjectId("607b2629aca5b54a80cf4706")

  try {

    let partys = await getAllParty()
    partys = partys || []
    const partysLength = partys.length
    if (partys && partysLength > 0) {
      for (let i = 0; i < partysLength; i++) {

        const cuttTypes = partys[i].cuttingType || []
        const cuttTypesLength = cuttTypes.length
        if (cuttTypes && cuttTypesLength > 0) {
  
          for (let j = 0; j < cuttTypesLength; j++) {
            let type = cuttTypes[j].cutType
            let loats = await getAllLoat(type, partys[i]._id)
  
            loats = loats || []
            const loatsLength = loats.length 
            for (let k = 0; k < loatsLength; k++) {
              const date = loats[k].entryDate
              const loatId = loats[k]._id
  
              loats[k].month = await helper.getMonth(date) + 1
              loats[k].year = await helper.getYear(date)
              loats[k].cutId = cuttTypes[j]._id
  
              const loat = await updateLoat(loatId, loats[k])
              // console.log('=-------loat-updated---===-=', loat);
            }
            // console.log('=-----------===-=', loats);
          }
        }
      }
    }

    console.log("updated successfully!!")
    res.send(successRes("updated successfully!!"))
  } catch (error) {
    console.log('error', error);
  }
}

const getAllParty = async () => {

  try {

    return await model.Party.find({})

  } catch (error) {
    console.log('error', error);
  }

}

const getAllLoat = async (cuttingType, partyId) => {

  try {
    return await model.Loat.find({
      partyId,
      cuttingType
    })
  } catch (error) {
    console.log('error', error);
  }

}

const updateLoat = async (loatId, updateObject) => {

  try {
    return await model.Loat.updateOne({
      _id: loatId,
    },{
      $set: updateObject
    })
  } catch (error) {
    console.log('error', error);
  }

}

export const TestController = {
  updateFunction
}