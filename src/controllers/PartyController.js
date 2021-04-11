import mongoose from "mongoose"
import { uploadFileToStorage } from "../functions/uploadfile"
import helper, { errorRes, successRes } from "../functions/helper"
import { model } from "../models"
import Partyschema from "../validation/PartySchema"
import moment from "moment"

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

    let party = await model.Party.find(query).sort({ 'createdAt':1})

    res.send(successRes(party)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

const getSingleParty = async (req, res, next) => {
    try {
        const { _id } = req.user // login user bodyData
        const { partyId } = req.params
        const query = {
            isDelete : false,
            userId: _id,
            _id:partyId
        }

        let party = await model.Party.findOne(query,{ cuttingType: 0})

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
      updateData.cuttingType = [JSON.parse(req.body.cuttingType)] // cuttingType is json stringyfied
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

        const cutID = cuttingData.update_id || ""

        if (cutID !== "") {
          let getIndex = partyData.cuttingType.findIndex((d) => d._id.toString() == cutID)

          if (getIndex !== -1) {
            partyData.cuttingType[getIndex] = cuttingData
            cuttingTypeData.push(partyData.cuttingType[getIndex])
            partyData.cuttingType.splice(getIndex,1);
          } else {
            throw { message : `update id ==> ${cutID} Not Exists` }
          }

        } else {
          let typeExist = partyData.cuttingType.find((d) => d.cutType === cuttingData.cutType)

          if (!typeExist) {
            if(cutID === ""){
              delete cuttingData.update_id
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

    console.log(error);
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
              $match :{
                  $and:  [
                      { partyId: ObjectId(partyId)},
                      { userId: _id },
                      { isDelete: false },
                      {
                          cuttingType:{
                              "$exists": true,
                              "$ne": null,
                          }
                      },
                  ]
              }
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
                                  then: { $round:[{ "$multiply": ["$numOfDimonds","$loatPrice"] }, 2] },
                                  else: { $round:[{ "$multiply": ["$loatWeight","$loatPrice"] }, 2] },
                              }
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
          { $sort : { _id : -1 } }
      ])

    let party = await model.Party.aggregate([
        {
            $match :{
                $and:  [
                    { _id: ObjectId(partyId)},
                    { userId: _id },
                ]
            }
        },
        {
            $project: {
                _id:1,
                isActive : 1,
                isDelete : 1,
                mobile : 1,
                name : 1,
                billingName : 1,
                userId:1,
                balanceSheet: 1,
                createdAt:1,
                updatedAt: 1,
                cuttingType : {
                  $filter: {
                  input: "$cuttingType",
                  as: "item",
                  cond: {$eq: ["$$item.isDelete", false]}
                }
              }
            }
        }
      ])

    party = party[0] || {}

    let allKeys = {
      TotalDimonds: 0,
      TotalWeight: 0,
      TotalAmount: 0,
      TotalDiamondWiseCount: 0,
      TotalDiamondWiseWeight: 0,
      TotalDiamondWiseAmount: 0,
      TotalWeightWiseCount: 0,
      TotalWeightWiseWeight: 0,
      TotalWeightWiseAmount: 0,
      paymentDetails:[]
    }
    
    const partyDetail = party.cuttingType || []

      if (partyDetail && partyDetail.length > 0) {
          partyDetail.map((type) => {
              allKeys.paymentDetails.push(
                  {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
                  {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
              )
          })
      }

    const totalLoatLength = loats.length
    if (loats && totalLoatLength > 0) {
      for (let i=0; i<totalLoatLength; i++) {

        const totalTypeWiseLoatLength = loats[i].typeWiseLoat.length
        const tLoat = loats[i].typeWiseLoat
          let typeWiseTotal = {
              loatsPrices:0,
              loatsCaret:0
          }

          let newAllKeys = {
              TotalDimonds: 0,
              TotalWeight: 0,
              TotalAmount: 0,
              TotalDiamondWiseCount: 0,
              TotalDiamondWiseWeight: 0,
              TotalDiamondWiseAmount: 0,
              TotalWeightWiseCount: 0,
              TotalWeightWiseWeight: 0,
              TotalWeightWiseAmount: 0,
              paymentDetails:[]
          }

          partyDetail.map((type) => {
            newAllKeys.paymentDetails.push(
                {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
                {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
            )
          })

        if (totalTypeWiseLoatLength > 0) {
          for (let j=0; j<totalTypeWiseLoatLength; j++) {

            const index1 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Diamonds (${tLoat[j]._id.type})`)
            const index2 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Weight (${tLoat[j]._id.type})`)
            const index3 = allKeys.paymentDetails.findIndex((d) => d.key === `Total Amount (${tLoat[j]._id.type})`)
            const index4 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Count (${tLoat[j]._id.type})`)
            const index5 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Weight (${tLoat[j]._id.type})`)
            const index6 = allKeys.paymentDetails.findIndex((d) => d.key === `Diamond Wise Amount (${tLoat[j]._id.type})`)
            const index7 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Diamond (${tLoat[j]._id.type})`)
            const index8 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Weight (${tLoat[j]._id.type})`)
            const index9 = allKeys.paymentDetails.findIndex((d) => d.key === `Weight Wise Amount (${tLoat[j]._id.type})`)
            const loatsLength = tLoat[j].loats.length
            const allLoats = tLoat[j].loats
            if ((index4 !== -1 || index7 !== -1) && loatsLength > 0) {

              for (let k=0; k<loatsLength; k++) {
                if (allLoats[k].multiWithDiamonds) {
                  if (index4 !== -1) {
                    allKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index3].value += allLoats[k].price

                    allKeys.paymentDetails[index4].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index5].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index6].value += allLoats[k].price

                    allKeys.TotalDimonds += allLoats[k].numOfDimonds
                    allKeys.TotalWeight += allLoats[k].loatWeight
                    allKeys.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                    allKeys.TotalDiamondWiseWeight += allLoats[k].loatWeight
                    allKeys.TotalDiamondWiseAmount += allLoats[k].price
                    allKeys.TotalAmount += allLoats[k].price

                    newAllKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    newAllKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    newAllKeys.paymentDetails[index3].value += allLoats[k].price

                    newAllKeys.paymentDetails[index4].value += allLoats[k].numOfDimonds
                    newAllKeys.paymentDetails[index5].value += allLoats[k].loatWeight
                    newAllKeys.paymentDetails[index6].value += allLoats[k].price

                    newAllKeys.TotalDimonds += allLoats[k].numOfDimonds
                    newAllKeys.TotalWeight += allLoats[k].loatWeight
                    newAllKeys.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                    newAllKeys.TotalDiamondWiseWeight += allLoats[k].loatWeight
                    newAllKeys.TotalDiamondWiseAmount += allLoats[k].price
                    newAllKeys.TotalAmount += allLoats[k].price

                    typeWiseTotal.loatsDiamondsWisePrice += allLoats[k].price
                    typeWiseTotal.loatsCaret += allLoats[k].loatWeight
                  }
                } else {
                  if (index7 !== -1) {

                    allKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index3].value += allLoats[k].price

                    allKeys.paymentDetails[index7].value += allLoats[k].numOfDimonds
                    allKeys.paymentDetails[index8].value += allLoats[k].loatWeight
                    allKeys.paymentDetails[index9].value += allLoats[k].price

                    allKeys.TotalDimonds += allLoats[k].numOfDimonds
                    allKeys.TotalWeight += allLoats[k].loatWeight
                    allKeys.TotalWeightWiseCount += allLoats[k].numOfDimonds
                    allKeys.TotalWeightWiseWeight += allLoats[k].loatWeight
                    allKeys.TotalWeightWiseAmount += allLoats[k].price
                    allKeys.TotalAmount += allLoats[k].price

                    newAllKeys.paymentDetails[index1].value += allLoats[k].numOfDimonds
                    newAllKeys.paymentDetails[index2].value += allLoats[k].loatWeight
                    newAllKeys.paymentDetails[index3].value += allLoats[k].price

                    newAllKeys.paymentDetails[index4].value += allLoats[k].numOfDimonds
                    newAllKeys.paymentDetails[index5].value += allLoats[k].loatWeight
                    newAllKeys.paymentDetails[index6].value += allLoats[k].price

                    newAllKeys.TotalDimonds += allLoats[k].numOfDimonds
                    newAllKeys.TotalWeight += allLoats[k].loatWeight
                    newAllKeys.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                    newAllKeys.TotalDiamondWiseWeight += allLoats[k].loatWeight
                    newAllKeys.TotalDiamondWiseAmount += allLoats[k].price
                    newAllKeys.TotalAmount += allLoats[k].price

                    typeWiseTotal.loatsPrices += allLoats[k].price
                    typeWiseTotal.loatsCaret += allLoats[k].loatWeight
                  }
                }
              }
            }
          }
        }
        loats[i].dayWiseTotal = newAllKeys
      }
    }

    const payment = { party, loats, allKeys}

    res.send(successRes(payment)) // get success response
  } catch (error) {
      console.log('error', error)
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

    // const findDate = `${moment(moment(date, 'DD-MM-YYYY')).format('YYYY-MM-DD')}T05:30:00.000+05:30`
    const findDate = await helper.formatDate(date)

    let loats = await model.Loat.aggregate([
        {
            $match :{ $and:  [{ userId: _id }, { entryDate: new Date(findDate) }, { isDelete : false } ] }
        },
        { 
            $lookup: {
              from: "parties",
              localField: "partyId",
              foreignField: _id,
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
                                then: { $round:[{ "$multiply": ["$numOfDimonds","$loatPrice"] }, 2]},
                                else: 0 
                              }
                        },
                        weightWiseprice:{
                          $cond: { 
                            if: { "$eq": [ "$multiWithDiamonds", false ] },
                              then: { $round:[{ "$multiply": ["$loatWeight","$loatPrice"] }, 2]},
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
            totalWeight : { $round:[{ $sum: "$loats.loatWeight" }, 2]},
            totalDimonds : { $sum: "$loats.numOfDimonds" },
            totalWeightWisePayment : { $round:[{ $sum: "$loats.weightWiseprice" }, 2]},
            totalDimondsWisePayment : { $round:[{ $sum: "$loats.diamondWiseprice" }, 2]},
          }
        },
        {
          $addFields:{
            totalPayment : { $round:[{ $sum: ["$totalWeightWisePayment", "$totalDimondsWisePayment"] }, 2] },
          }
        },
        { $sort : { _id : -1 } }
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
                  $sum: "$loatWeight",
              },
              totalDimonds: {
                  $sum: "$numOfDimonds",
              }
          }
        },
        {
          $group: {
              _id : { "month":{$month:"$_id"}, "year": {$year:"$_id"} },
              dayWiseTotal: {
                $push: "$$ROOT"
              },
              monthWiseTotalWeight:{ $sum: "$totalWeight" },
              monthWiseTotalDimonds:{ $sum: "$totalDimonds" },
          }
        },
        {
          $group: {
              _id : "$_id.year",
              monthWiseTotal: {
                $push: "$$ROOT"
              },
              yearWiseTotalWeight:{ $sum: "$monthWiseTotalWeight" },
              yearWiseTotalDimonds:{ $sum: "$monthWiseTotalDimonds" },
          }
        },
        {
          $sort: { _id: -1 } 
        }
      ])

    res.send(successRes(loats))
  } catch (error) {
    res.send(errorRes(error.message))
  }
}


const getPartyLoatYearWise = async (req, res, next) => {
  try {
    const { partyId } = req.params
    const { _id } = req.user // login user bodyData

    if (!partyId) {
        throw { message: "PartyId is Require" }
    }

    let loats = await model.Loat.aggregate([
        {
            $match :{
                $and:  [
                    { partyId: ObjectId(partyId)},
                    { userId: _id },
                    { isDelete : false },
                    {
                        cuttingType:{
                            "$exists": true,
                            "$ne": null
                        }
                    }
                ]
            }
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
                                then: { $round:[{ "$multiply": ["$numOfDimonds","$loatPrice"] }, 2] },
                                else: { $round:[{ "$multiply": ["$loatWeight","$loatPrice"] }, 2] },
                            }
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
        {
            $group : {
                _id : { "month":{$month:"$_id"}, "year": {$year:"$_id"} },
                monthWiseLoats: {
                    $push: "$$ROOT"
                },
            },
        },
        {
            $group : {
                _id : "$_id.year",
                yearWiseLoats: {
                    $push: "$$ROOT"
                },
            },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            yearWiseLoats:1
          }
        },
        { $sort : { "year" : -1 } },
    ])

    let party = await model.Party.aggregate([
        {
            $match :{
                $and:  [
                    { _id: ObjectId(partyId)},
                    { userId: _id },
                ]
            }
        },
        {
            $project: {
                _id:1,
                isActive : 1,
                isDelete : 1,
                mobile : 1,
                name : 1,
                billingName : 1,
                userId:1,
                balanceSheet: 1,
                createdAt:1,
                updatedAt: 1,
                cuttingType : {
                  $filter: {
                  input: "$cuttingType",
                  as: "item",
                  cond: {$eq: ["$$item.isDelete", false]}
                }
              }
            }
        }
      ])
      
    party = party[0] || {}

    let allTotal = {
      TotalDimonds: 0,
      TotalWeight: 0,
      TotalAmount: 0,
      TotalDiamondWiseCount: 0,
      TotalDiamondWiseWeight: 0,
      TotalDiamondWiseAmount: 0,
      TotalWeightWiseCount: 0,
      TotalWeightWiseWeight: 0,
      TotalWeightWiseAmount: 0,
      paymentDetails:[]
    }
    
    const partyDetail = party.cuttingType || []

    if (partyDetail && partyDetail.length > 0) {
        partyDetail.map((type) => {
            allTotal.paymentDetails.push(
                {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
                {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
                {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
            )
        })
    }

    const yearLoats = loats
    const totalYearLength = loats.length
    if (yearLoats && totalYearLength > 0) {
      for (let year=0; year<totalYearLength; year++) {

        const yearWiseLoats = yearLoats[year].yearWiseLoats
        const totalMonthLength = yearLoats[year].yearWiseLoats.length

        let yearWiseTotal = {
          TotalDimonds: 0,
          TotalWeight: 0,
          TotalAmount: 0,
          TotalDiamondWiseCount: 0,
          TotalDiamondWiseWeight: 0,
          TotalDiamondWiseAmount: 0,
          TotalWeightWiseCount: 0,
          TotalWeightWiseWeight: 0,
          TotalWeightWiseAmount: 0,
          paymentDetails:[]
        }

        partyDetail.map((type) => {
          yearWiseTotal.paymentDetails.push(
              {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
              {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
              {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
              {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
              {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
              {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
              {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
              {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
              {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
          )
        })
        if (yearWiseLoats && totalMonthLength > 0) {
          for (let month=0; month<totalMonthLength; month++) {
              
            const totalLoatLength = yearWiseLoats[month].monthWiseLoats.length
            const dateWiseLoats = yearWiseLoats[month].monthWiseLoats

            let monthWiseTotal = {
              TotalDimonds: 0,
              TotalWeight: 0,
              TotalAmount: 0,
              TotalDiamondWiseCount: 0,
              TotalDiamondWiseWeight: 0,
              TotalDiamondWiseAmount: 0,
              TotalWeightWiseCount: 0,
              TotalWeightWiseWeight: 0,
              TotalWeightWiseAmount: 0,
              paymentDetails:[]
            }

            partyDetail.map((type) => {
              monthWiseTotal.paymentDetails.push(
                  {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
                  {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
                  {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
              )
            })

            if (dateWiseLoats && totalLoatLength > 0) {
              for (let date=0; date<totalLoatLength; date++) {

                const totalTypeWiseLoatLength = dateWiseLoats[date].typeWiseLoat.length
                const tLoat = dateWiseLoats[date].typeWiseLoat
                let typeWiseTotal = {
                    loatsPrices:0,
                    loatsCaret:0
                }

                let dayWiseTotal = {
                    TotalDimonds: 0,
                    TotalWeight: 0,
                    TotalAmount: 0,
                    TotalDiamondWiseCount: 0,
                    TotalDiamondWiseWeight: 0,
                    TotalDiamondWiseAmount: 0,
                    TotalWeightWiseCount: 0,
                    TotalWeightWiseWeight: 0,
                    TotalWeightWiseAmount: 0,
                    paymentDetails:[]
                }

                partyDetail.map((type) => {
                    dayWiseTotal.paymentDetails.push(
                        {key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price},
                        {key: `Total Weight (${type.cutType})`, value: 0, price:type.price},
                        {key: `Total Amount (${type.cutType})`, value: 0, price:type.price},
                        {key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price},
                        {key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price},
                        {key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price},
                        {key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price},
                        {key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price},
                        {key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price},
                    )
                })

                if (totalTypeWiseLoatLength > 0) {
                  for (let j=0; j<totalTypeWiseLoatLength; j++) {

                    const index1 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Total Diamonds (${tLoat[j]._id.type})`)
                    const index2 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Total Weight (${tLoat[j]._id.type})`)
                    const index3 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Total Amount (${tLoat[j]._id.type})`)
                    const index4 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Diamond Wise Count (${tLoat[j]._id.type})`)
                    const index5 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Diamond Wise Weight (${tLoat[j]._id.type})`)
                    const index6 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Diamond Wise Amount (${tLoat[j]._id.type})`)
                    const index7 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Weight Wise Diamond (${tLoat[j]._id.type})`)
                    const index8 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Weight Wise Weight (${tLoat[j]._id.type})`)
                    const index9 = dayWiseTotal.paymentDetails.findIndex((d) => d.key === `Weight Wise Amount (${tLoat[j]._id.type})`)
                    const loatsLength = tLoat[j].loats.length
                    const allLoats = tLoat[j].loats

                    if ((index4 !== -1 || index7 !== -1) && loatsLength > 0) {

                      for (let k=0; k<loatsLength; k++) {
                        if (allLoats[k].multiWithDiamonds) {
                          if (index4 !== -1) {
                            allTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            allTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            allTotal.paymentDetails[index3].value += allLoats[k].price

                            allTotal.paymentDetails[index4].value += allLoats[k].numOfDimonds
                            allTotal.paymentDetails[index5].value += allLoats[k].loatWeight
                            allTotal.paymentDetails[index6].value += allLoats[k].price

                            allTotal.TotalDimonds += allLoats[k].numOfDimonds
                            allTotal.TotalWeight += allLoats[k].loatWeight
                            allTotal.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                            allTotal.TotalDiamondWiseWeight += allLoats[k].loatWeight
                            allTotal.TotalDiamondWiseAmount += allLoats[k].price
                            allTotal.TotalAmount += allLoats[k].price

                            yearWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            yearWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            yearWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            yearWiseTotal.paymentDetails[index4].value += allLoats[k].numOfDimonds
                            yearWiseTotal.paymentDetails[index5].value += allLoats[k].loatWeight
                            yearWiseTotal.paymentDetails[index6].value += allLoats[k].price

                            yearWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            yearWiseTotal.TotalWeight += allLoats[k].loatWeight
                            yearWiseTotal.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                            yearWiseTotal.TotalDiamondWiseWeight += allLoats[k].loatWeight
                            yearWiseTotal.TotalDiamondWiseAmount += allLoats[k].price
                            yearWiseTotal.TotalAmount += allLoats[k].price

                            monthWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            monthWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            monthWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            monthWiseTotal.paymentDetails[index4].value += allLoats[k].numOfDimonds
                            monthWiseTotal.paymentDetails[index5].value += allLoats[k].loatWeight
                            monthWiseTotal.paymentDetails[index6].value += allLoats[k].price

                            monthWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            monthWiseTotal.TotalWeight += allLoats[k].loatWeight
                            monthWiseTotal.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                            monthWiseTotal.TotalDiamondWiseWeight += allLoats[k].loatWeight
                            monthWiseTotal.TotalDiamondWiseAmount += allLoats[k].price
                            monthWiseTotal.TotalAmount += allLoats[k].price

                            dayWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            dayWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            dayWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            dayWiseTotal.paymentDetails[index4].value += allLoats[k].numOfDimonds
                            dayWiseTotal.paymentDetails[index5].value += allLoats[k].loatWeight
                            dayWiseTotal.paymentDetails[index6].value += allLoats[k].price

                            dayWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            dayWiseTotal.TotalWeight += allLoats[k].loatWeight
                            dayWiseTotal.TotalDiamondWiseCount += allLoats[k].numOfDimonds
                            dayWiseTotal.TotalDiamondWiseWeight += allLoats[k].loatWeight
                            dayWiseTotal.TotalDiamondWiseAmount += allLoats[k].price
                            dayWiseTotal.TotalAmount += allLoats[k].price

                            typeWiseTotal.loatsDiamondsWisePrice += allLoats[k].price
                            typeWiseTotal.loatsCaret += allLoats[k].loatWeight
                          }
                        } else {
                          if (index7 !== -1) {
                            allTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            allTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            allTotal.paymentDetails[index3].value += allLoats[k].price

                            allTotal.paymentDetails[index7].value += allLoats[k].numOfDimonds
                            allTotal.paymentDetails[index8].value += allLoats[k].loatWeight
                            allTotal.paymentDetails[index9].value += allLoats[k].price

                            allTotal.TotalDimonds += allLoats[k].numOfDimonds
                            allTotal.TotalWeight += allLoats[k].loatWeight
                            allTotal.TotalWeightWiseCount += allLoats[k].numOfDimonds
                            allTotal.TotalWeightWiseWeight += allLoats[k].loatWeight
                            allTotal.TotalWeightWiseAmount += allLoats[k].price
                            allTotal.TotalAmount += allLoats[k].price

                            yearWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            yearWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            yearWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            yearWiseTotal.paymentDetails[index7].value += allLoats[k].numOfDimonds
                            yearWiseTotal.paymentDetails[index8].value += allLoats[k].loatWeight
                            yearWiseTotal.paymentDetails[index9].value += allLoats[k].price

                            yearWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            yearWiseTotal.TotalWeight += allLoats[k].loatWeight
                            yearWiseTotal.TotalWeightWiseCount += allLoats[k].numOfDimonds
                            yearWiseTotal.TotalWeightWiseWeight += allLoats[k].loatWeight
                            yearWiseTotal.TotalWeightWiseAmount += allLoats[k].price
                            yearWiseTotal.TotalAmount += allLoats[k].price

                            monthWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            monthWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            monthWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            monthWiseTotal.paymentDetails[index7].value += allLoats[k].numOfDimonds
                            monthWiseTotal.paymentDetails[index8].value += allLoats[k].loatWeight
                            monthWiseTotal.paymentDetails[index9].value += allLoats[k].price

                            monthWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            monthWiseTotal.TotalWeight += allLoats[k].loatWeight
                            monthWiseTotal.TotalWeightWiseCount += allLoats[k].numOfDimonds
                            monthWiseTotal.TotalWeightWiseWeight += allLoats[k].loatWeight
                            monthWiseTotal.TotalWeightWiseAmount += allLoats[k].price
                            monthWiseTotal.TotalAmount += allLoats[k].price

                            dayWiseTotal.paymentDetails[index1].value += allLoats[k].numOfDimonds
                            dayWiseTotal.paymentDetails[index2].value += allLoats[k].loatWeight
                            dayWiseTotal.paymentDetails[index3].value += allLoats[k].price

                            dayWiseTotal.paymentDetails[index7].value += allLoats[k].numOfDimonds
                            dayWiseTotal.paymentDetails[index8].value += allLoats[k].loatWeight
                            dayWiseTotal.paymentDetails[index9].value += allLoats[k].price

                            dayWiseTotal.TotalDimonds += allLoats[k].numOfDimonds
                            dayWiseTotal.TotalWeight += allLoats[k].loatWeight
                            dayWiseTotal.TotalWeightWiseCount += allLoats[k].numOfDimonds
                            dayWiseTotal.TotalWeightWiseWeight += allLoats[k].loatWeight
                            dayWiseTotal.TotalWeightWiseAmount += allLoats[k].price
                            dayWiseTotal.TotalAmount += allLoats[k].price

                            typeWiseTotal.loatsPrices += allLoats[k].price
                            typeWiseTotal.loatsCaret += allLoats[k].loatWeight
                          }
                        }
                      }
                    }
                  }
                }

                dateWiseLoats[date].dayWiseTotal = dayWiseTotal
              }
            }
            
            yearWiseLoats[month].monthWiseTotal = monthWiseTotal
          }
        }
        
        yearLoats[year].yearWiseTotal = yearWiseTotal
      }
    }

    const payment = { party, loats, allTotal}

    res.send(successRes(payment)) // get success response
  } catch (error) {
    res.send(errorRes(error.message)) // get error response
  }
}

export const PartyController = {
  getParty,
  getSingleParty,
  addParty,
  updateParty,
  getPartyLoatDateWise,
  getPartyLoatYearWise,
  getAllPartyLoatsDateWise,
  getAllEntryDate
}
