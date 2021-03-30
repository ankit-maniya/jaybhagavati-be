import mongoose from "mongoose"
import { uploadFileToStorage } from "../functions/uploadfile"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import Partyschema from "../validation/PartySchema"

const ObjectId = mongoose.Types.ObjectId

const getParty = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData

    const query = {
      isDelete : false,
      userId: _id,
      // cuttingType: {
      //   "$elemMatch": {
      //     isDelete: false
      //   }
      // }
    }

    let party = await model.Party.find(query).sort({ 'name':1})

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

    // // add cuttingType with push old cuttingType (combine)
    // if (updateData["cuttingType"]) {
    //   updateData["cuttingType"].map((cuttingData) => {
    //     if (cuttingData._id) {
    //       let getIndex = partyData.cuttingType.findIndex((d) => d.id === cuttingData._id)
    //       if (getIndex !== undefined && getIndex !== -1) {
    //         updateData["cuttingType"][getIndex] = cuttingData
    //       }
    //     }
    //   })
    // }

    // add cuttingType with push old cuttingType (combine) updateData
    let cuttingTypeData = []
    if (updateData["cuttingType"]) {
      updateData["cuttingType"].map((cuttingData) => {

        const cutID = cuttingData._id || ""

        if (cutID !== "") {
          let getIndex = partyData.cuttingType.findIndex((d) => d._id.toString() == cutID._id)

          if (getIndex !== -1) {
            partyData.cuttingType[getIndex] = cuttingData
            cuttingTypeData.push(partyData.cuttingType[getIndex])
            partyData.cuttingType.splice(getIndex,1);
          } else {
            throw { message : `update id ==> ${cutID._id} Not Exists` }
          }

        } else {
          let typeExist = partyData.cuttingType.find((d) => d.cutType === cuttingData.cutType)

          if (!typeExist) {
            if(cutID === ""){
              delete cuttingData._id
            }
            
            cuttingTypeData.push(cuttingData)
          } else {
            throw { message : `${typeExist.cutType} Cutting Type is Already Exists` }
          }

        }
      })

      updateData["cuttingType"] = [...cuttingTypeData,...partyData.cuttingType]
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
        $unwind: '$cuttingType'
      },
      {
          $group : {
              _id : { type: "$cuttingType", date : "$entryDate"},
              loats: {
                  $push: {
                      type:"$cuttingType",
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
      { $sort : { "_id" : 1 } }
    ])

    let party = await model.Party.findOne({ _id: ObjectId(partyId) })

    let allKeys = {
      TotalDimonds: 0,
      TotalWeight: 0,
      TotalDiamondWiseCount: 0,
      TotalDiamondWiseWeight: 0,
      TotalDiamondWiseAmount: 0,
      TotalWeightWiseCount: 0,
      TotalWeightWiseWeight: 0,
      TotalWeightWiseAmount: 0,
      TotalAmount: 0,
      paymentDetails:[]
    }
    
    const partyDetail = party.cuttingType || [] 

    partyDetail.map((type) => {
      allKeys.paymentDetails.push(
        { key: `Total Diamonds (${type.cutType})`, value: 0 },
        { key: `Total Weight (${type.cutType})`, value: 0 },
        { key: `Diamond Wise Count (${type.cutType})`, value: 0 },
        { key: `Diamond Wise Weight (${type.cutType})`, value: 0 },
        { key: `Diamond Wise Amount (${type.cutType})`, value: 0 },
        { key: `Weight Wise Diamond (${type.cutType})`, value: 0 },
        { key: `Weight Wise Weight (${type.cutType})`, value: 0 },
        { key: `Weight Wise Amount (${type.cutType})`, value: 0 },
        { key: `Total Amount (${type.cutType})`, value: 0 }
      )
    })

    const totalLoatLength = loats.length
    if (loats && totalLoatLength > 0) {
      for (let i=0; i<totalLoatLength; i++) {

        const totalTypeWiseLoatLength = loats[i].typeWiseLoat.length
        const tLoat = loats[i].typeWiseLoat
        if (totalTypeWiseLoatLength > 0) {
          for (let j=0; j<totalTypeWiseLoatLength; j++) {
            
            // let typeWiseTotal = {
            //   loatsDimonds: 0,
            //   loatsDiamondsWisePrice: 0,
            //   loatsPrices:0,
            //   loatsCaret:0
            // }

            const index1 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Diamonds (${tLoat[j]._id.type})`)
            const index2 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Weight (${tLoat[j]._id.type})`)
            const index3 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Count (${tLoat[j]._id.type})`)
            const index4 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Weight (${tLoat[j]._id.type})`)
            const index5 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Amount (${tLoat[j]._id.type})`)
            const index6 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Diamond (${tLoat[j]._id.type})`)
            const index7 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Weight (${tLoat[j]._id.type})`)
            const index8 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Amount (${tLoat[j]._id.type})`)
            const index9 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Amount (${tLoat[j]._id.type})`)
            const loatsLength = tLoat[j].loats.length
            const allLoats = tLoat[j].loats
            if ((index3 !== -1 || index6 !== -1) && loatsLength > 0) {

              for (let k=0; k<loatsLength; k++) {
                if (allLoats[k].multiWithDiamonds) {
                  if (index3 !== -1) {
                    allKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index9].value += allLoats[k].price

                    allKeys.paymentDetails[index3].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index4].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index5].value += allLoats[k].price
                    // typeWiseTotal.loatsDimonds += allLoats[k].numOfDimonds
                    // typeWiseTotal.loatsDiamondsWisePrice += allLoats[k].price
                    // typeWiseTotal.loatsCaret += allLoats[k].loatWeight

                    allKeys.TotalDimonds += allLoats[k].numOfDimonds
                    allKeys.TotalWeight += allLoats[k].loatWeight
                    allKeys.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                    allKeys.TotalDiamondWiseWeight += allLoats[k].loatWeight
                    allKeys.TotalDiamondWiseAmount += allLoats[k].price
                    allKeys.TotalAmount += allLoats[k].price
                  }
                } else {
                  if (index6 !== -1) {

                    allKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index9].value += allLoats[k].price

                    allKeys.paymentDetails[index6].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index7].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index8].value += allLoats[k].price
                    // typeWiseTotal.loatsPrices += allLoats[k].price
                    // typeWiseTotal.loatsCaret += allLoats[k].loatWeight

                    allKeys.TotalDimonds += allLoats[k].numOfDimonds
                    allKeys.TotalWeight += allLoats[k].loatWeight
                    allKeys.TotalWeightWiseCount += allLoats[k].numOfDimonds
                    allKeys.TotalWeightWiseWeight += allLoats[k].loatWeight
                    allKeys.TotalWeightWiseAmount += allLoats[k].price
                    allKeys.TotalAmount += allLoats[k].price
                  }
                }
              }

             // loats[i].typeWiseLoat[j].typeWiseTotal = typeWiseTotal
            }
          }
        }
      }
    }

    const payment = { party, loats, allKeys}

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

    // const findDate = new Date(`${moment(date).format("YYYY-MM-DD")}T05:30:00.000+05:30`)
    const findDate = await helper.formatDate(date)

    let loats = await model.Loat.aggregate([
        {
            $match :{ $and:  [{ userId: _id }, { entryDate: findDate }, { isDelete : false } ] }
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
                        loatId:"$_id",
                        entryDate:"$entryDate",
                        cuttingType:"$cuttingType",
                        numOfDimonds:"$numOfDimonds",
                        loatWeight:"$loatWeight",
                        loatPrice:"$loatPrice",
                        multiWithDiamonds:"$multiWithDiamonds",
                        diamondWiseprice:{
                            $cond: { 
                              if: { "$eq": [ "$multiWithDiamonds", true ] },
                                then: { "$multiply": ["$numOfDimonds","$loatPrice"] }, 
                                else: 0 
                              }
                        },
                        weightWiseprice:{
                          $cond: { 
                            if: { "$eq": [ "$multiWithDiamonds", false ] },
                              then: { "$multiply": ["$loatWeight","$loatPrice"] },
                              else: 0 
                            },
                        },
                        partyId:{ $first:"$party._id" },
                        name:{ $first:"$party.name" },
                        mobile:{ $first:"$party.mobile" }
                    },
                }
            },
        },
        {
          $addFields:{
            totalWeight : { $sum: "$loats.loatWeight" },
            totalDimonds : { $sum: "$loats.numOfDimonds" },
            totalWeightWisePayment : { $sum: "$loats.weightWiseprice" },
            totalDimondsWisePayment : { $sum: "$loats.diamondWiseprice" },
          }
        },
        {
          $addFields:{
            totalPayment : { $sum: ["$totalWeightWisePayment", "$totalDimondsWisePayment"] },
          }
        },
        { $sort : { _id : 1 } }
    ])

    res.send(successRes(loats)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}


const getAllEntryDate = async (req, res, next) => {
  try {
    const { _id } = req.user // login user bodyData

    const loats = await model.Loat.aggregate([
        {
          $match :{ $and:  [{ userId: _id }, { isDelete : false } ] }
        },
        {
          $group: {
              _id:"$entryDate",
              totalWeight: {
                  $sum: "$loatWeight"
              },
              totalDimonds: {
                  $sum: "$numOfDimonds"
              }
          }
        }
      ])

    res.send(successRes(loats))
  } catch (error) {
    res.send(errorRes(error.message))
  }
}

export const PartyController = {
  getParty,
  addParty,
  updateParty,
  getPartyLoatDateWise,
  getAllPartyLoatsDateWise,
  getAllEntryDate
}
