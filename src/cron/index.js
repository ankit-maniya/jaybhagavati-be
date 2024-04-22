import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import { model } from "../models/index.js";

import { PartyController } from "../controllers/PartyController.js";

import { errorRes, successRes } from "../functions/helper.js";

const getLoats = async (req, res, next) => {
  try {
    const oldUser = {
      isActive: true,
      isDelete: false,
      role: "USER",
      _id: "605789a6254f1c2d3e838cd5",
      mobile: "9913079272",
      name: "jay bhagavati laser",
      email: "jaybhagavati@gmail.com",
      password: "$2b$10$a1XpcRcrSEq/2V.SNawdAOOX9I4tKbFS7Sy5dfVfcM1VwE4hJiO7.",
      address: [],
      __v: 0,
    };

    const newUser = {
      _id: ObjectId("6316ec141a45abc2fd36cf10"),
      partyId: "6316ec141a45abc2fd36cf10",
      isActive: true,
      isDelete: false,
      role: "USER",
      mobile: "9662559257",
      name: "jay bhagavati laser",
      email: "jaybhagavati01@gmail.com",
      password: "$2b$10$a1XpcRcrSEq/2V.SNawdAOOX9I4tKbFS7Sy5dfVfcM1VwE4hJiO7.",
      address: [],
      __v: { $numberInt: "0" },
    };

    // const cuttingTypes = await model.CuttingType.find({"userId": ObjectId(oldUser._id), isDelete: false})

    // const changeUserID = [];
    // partys.forEach((party, index) => {
    // let newObject ={
    //     "openingBalance": party.openingBalance,
    //     "isActive": party.isActive,
    //     "isDelete": party.isDelete,
    //     "mobile": party.mobile,
    //     "name": party.name,
    //     "billingName": party.billingName,
    //     "cuttingType": party.cuttingType,
    //     "balanceSheet": party.balanceSheet,
    //     "createdAt": party.createdAt,
    //     "updatedAt": party.updatedAt,
    //     "partyId": newUser.partyId,
    //     "userId": newUser._id
    // }
    //   party.userId = newUser._id
    //   changeUserID.push(newObject);
    // });

    // const changeUserID = [];
    // cuttingTypes.forEach((cuttingType, index) => {
    //     let newObject ={
    //         "price": cuttingType.price,
    //         "multiWithDiamonds": cuttingType.multiWithDiamonds,
    //         "colorCode": cuttingType.colorCode,
    //         "isActive": cuttingType.isActive,
    //         "isDelete": cuttingType.isDelete,
    //         "cutType": cuttingType.cutType,
    //         "createdAt": cuttingType.createdAt,
    //         "updatedAt": cuttingType.updatedAt,
    //         "userId": newUser._id
    //     }
    //   changeUserID.push(newObject);
    // });

    // const insertManyParty = await model.CuttingType.insertMany(changeUserID)
    const changeUserID = [];

    const loats = await model.Loat.find({
      userId: ObjectId(oldUser._id),
      year: 2022,
      isDelete: false,
      month: 8,
    });

    console.log('loats :: ', loats.length);

    // for (let i = 0; i < loats.length; i++) {

    //   let partyName = loats[`${i}`]['partyName'];

    //   console.log('partyName ---------- :: ', partyName);
    //   if (partyName) {
    //     let partyDetail = await model.Party.findOne({
    //       userId: newUser._id,
    //       name: partyName,
    //     });

    //     if (partyDetail) {
    //       let newObject = {
    //         multiWithDiamonds: loats[i].multiWithDiamonds,
    //         entryDate: loats[i].entryDate,
    //         partyId: partyDetail._id,
    //         numOfDimonds: loats[i].numOfDimonds,
    //         loatWeight: loats[i].loatWeight,
    //         cuttingType: loats[i].cuttingType,
    //         loatPrice: loats[i].loatPrice,
    //         partyName: partyDetail.name,
    //         month: loats[i].month,
    //         year: loats[i].year,
    //         isActive: loats[i].isActive,
    //         isDelete: loats[i].isDelete,
    //         createdAt: loats[i].createdAt,
    //         updatedAt: loats[i].updatedAt,
    //         userId: partyDetail.userId,
    //       };

    //       const record = await model.Loat.create(newObject);
    //       changeUserID.push(record);
    //     }
    //   }
    // }

    res.json({
      length: loats.length,
      changeUserIDlength: changeUserID.length,
      changeUserID,
      loats,
    });

    // loatId require in Party collection
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

export const CronController = {
  getLoats,
};
