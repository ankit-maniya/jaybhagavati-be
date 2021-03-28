import mongoose, { Mongoose } from "mongoose"
import { uploadFileToStorage } from "../functions/uploadfile"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import Partyschema from "../validation/PartySchema"
import moment from "moment"

const ObjectId = mongoose.Types.ObjectId

const getParty = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const filter = { isDelete : false, userId: _id }

    let party = await model.Party.find(filter)

    res.send(successRes(party)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const addParty = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer
    const { _id } = req.user // login user bodyData

    const bodyData = req.body

    if (req.body.cuttingType) {
      bodyData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    if (req.body.balanceSheet) {
      bodyData.balanceSheet = JSON.parse(req.body.balanceSheet) // balanceSheet is json stringyfied
    }

    const isValidate = await Partyschema.checkAddPartyInputValidate(bodyData) // validate a key and value

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

    let partyData = await model.Party.create({...bodyData, userId: _id}) // add party bodyData

    if (req.files && req.files.profile) {
      // move file from TEMP location
      await helper.moveFile(partyData.profile, partyData._id, "PARTY")
    }

    res.send(successRes(partyData)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const updateParty = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res) // upload file using multer as a middle ware

    const { _id } = req.user // login user bodyData
    const updateData = req.body
    
    if (req.body.cuttingType) {
      updateData.cuttingType = JSON.parse(req.body.cuttingType) // cuttingType is json stringyfied
    }

    if (req.body.balanceSheet) {
      bodyData.balanceSheet = JSON.parse(req.body.balanceSheet) // balanceSheet is json stringyfied
    }

    // update edited time
    updateData["updatedAt"] = new Date()
    const isValidate = await Partyschema.checkUpdatePartyInputValidate(
      updateData,
      _id
    )

    const partyData = await model.Party.findOne({ _id: req.body.partyId })

    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        helper.removeFile(req.files.profile[0].filename, "TEMP")
      }
      throw { message: isValidate.message }
    }

    // add cuttingType with push old cuttingType (combine)
    if (updateData["cuttingType"]) {
      updateData["cuttingType"].map((cuttingData) => {
        if (cuttingData._id) {
          let getIndex = partyData.cuttingType.findIndex((d) => d.id === cuttingData._id)
          if (getIndex !== undefined && getIndex !== -1) {
            updateData["cuttingType"][getIndex] = cuttingData
          }
        }
      })
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      updateData["profile"] = req.files.profile[0].filename
      await helper.moveFile(updateData["profile"], updateData.partyId, "PARTY") //move latest file role wise

      if (profile) {
        //delete old file
        helper.removeFile(profile, "PARTY", updateData.partyId)
      }
    }

    const party = await model.Party.findByIdAndUpdate(
      // update party bodyData and get latest bodyData
      {
        _id: updateData.partyId,
      },
      {
        $set: {...updateData, userId: _id},
      },
      { new: true }
    )

    res.send(successRes(party)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const getPartyLoatDateWise = async (req, res, next) => {
  try {
    const { partyId } = req.params
    const { _id } = req.user // login user bodyData

    if (!partyId) {
        throw { message: "PartyId is Require" }
    }

    let loats = await model.Loat.aggregate([
      {
        $match :{ $and:  [ { partyId: ObjectId(partyId)}, { userId: _id }, { isDelete : false } ] }
      },
      {
          $group : {
              _id : { type: "$cuttingType", date : "$entryDate"},
              loats: {
                  $push: {
                      numOfDimonds:"$numOfDimonds",
                      loatWeight:"$loatWeight",
                      loatPrice:"$loatPrice",
                      multiWithDiamonds:"$multiWithDiamonds",
                      price:{
                          $cond: { if: { "$eq": [ "$multiWithDiamonds", true ] },
                              then: { "$multiply": ["$numOfDimonds","$loatPrice"] }, 
                              else: { "$multiply": ["$loatWeight","$loatPrice"] } }
                      },
                  },
              }
          },
      },
      {
          $group : {
              _id : "$_id.date",
              typeWiseLoat: {
                  $push: "$$ROOT"
              },
          },
      },
    ])

    let partyDetail = await model.Party.findOne({ _id: ObjectId(partyId) })
    let allKeys = {
      TotalPayment: 0,
      paymentDetails:[]
    }
    
    partyDetail = partyDetail.cuttingType || [] 

    partyDetail.map((type) => {
      allKeys.paymentDetails.push({ key: `Total${type.cutType}Diamonds`, value: 0 }, { key: `Total${type.cutType}DiamondsWisePrice`, value: 0 }, { key: `Total${type.cutType}Price`, value: 0 })
    })

    const totalLoatLength = loats.length
    if (loats && totalLoatLength > 0) {
      for (let i=0; i<totalLoatLength; i++) {

        const totalTypeWiseLoatLength = loats[i].typeWiseLoat.length
        const tLoat = loats[i].typeWiseLoat
        if (totalTypeWiseLoatLength > 0) {
          for (let j=0; j<totalTypeWiseLoatLength; j++) {
            
            let typeWiseTotal = {
              loatsDimonds: 0,
              loatsDiamondsWisePrice: 0,
              loatsPrices:0
            }

            const index1 = allKeys.paymentDetails.findIndex((d) => d.key === `Total${tLoat[j]._id.type}Diamonds`)
            const index2 = allKeys.paymentDetails.findIndex((d) => d.key === `Total${tLoat[j]._id.type}DiamondsWisePrice`)
            const index3 = allKeys.paymentDetails.findIndex((d) => d.key === `Total${tLoat[j]._id.type}Price`)
            const loatsLength = tLoat[j].loats.length
            const allLoats = tLoat[j].loats
            if ((index1 !== -1 || index2 !== -1 || index3 !== -1) && loatsLength > 0) {

              for (let k=0; k<loatsLength; k++) {
                if (allLoats[k].multiWithDiamonds) {
                  if (index1 !== -1 && index2 !== -1) {

                    allKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    typeWiseTotal.loatsDimonds += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index2].value += allLoats[k].price
                    typeWiseTotal.loatsDiamondsWisePrice += allLoats[k].price
                    allKeys.TotalPayment += allLoats[k].price
                  }
                } else {
                  if (index3 !== -1) {

                    allKeys.paymentDetails[index3].value += allLoats[k].price
                    typeWiseTotal.loatsPrices += allLoats[k].price
                    allKeys.TotalPayment += allLoats[k].price
                  }
                }
              }

              loats[i].typeWiseLoat[j].typeWiseTotal = typeWiseTotal
            }
          }
        }
      }
    }

    const payment = { loats, allKeys}

    res.send(successRes(payment)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const getAllPartyLoatsDateWise = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData
    const { date } = req.body
    if (!date) {
        throw { message: "Date is Required!" }
    }  
    const findDate = new Date(`${date}T05:30:00.000+05:30`)

    let loats = await model.Loat.aggregate([
        {
            $match :{ $and:  [{ userId: _id }, { entryDate: findDate }, {"isDelete" : false} ] }
        },
        { 
            $lookup: {
              from: "parties",
              localField: "partyId",
              foreignField: "_id",
              as: "party"
            }
        },
        {
            $group : {
                _id :{ dateString: "$entryDate" },
                loats: {
                    $push: {
                        numOfDimonds:"$numOfDimonds",
                        loatWeight:"$loatWeight",
                        loatPrice:"$loatPrice",
                        multiWithDiamonds:"$multiWithDiamonds",
                        price:{
                            $cond: { if: { "$eq": [ "$multiWithDiamonds", true ] },
                                then: { "$multiply": ["$numOfDimonds","$loatPrice"] }, 
                                else: { "$multiply": ["$loatWeight","$loatPrice"] } }
                        },
                        partyId:{ $first:"$party._id" },
                        name:{ $first:"$party.name" },
                        mobile:{ $first:"$party.mobile" }
                    },
                }
            },
        },
        {
        $addFields:
          {
            totalWeight : { $sum: "$loats.loatWeight" },
            totalDimonds : { $sum: "$loats.numOfDimonds" },
            totalPayment : { $sum: "$loats.price" },
          }
      }
    ])

    res.send(successRes(loats)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const PartyController = {
  getParty,
  addParty,
  updateParty,
  getPartyLoatDateWise,
  getAllPartyLoatsDateWise
}
