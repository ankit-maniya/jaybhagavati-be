import mongoose from "mongoose";

import { model } from "../models/index.js";

const MigrateLoatTable = async (req, res, next) => {
  console.log("== Migrate Loat Type Table ==");
  let loats = [];
  let resData = [];
  let userId;
  let partyId;

  // loats = await model.Loat.find({});

  if (loats.length > 0) {
    console.log("INSERTING :: START", loats.length);

    for (const key in loats) {
      console.log("key :: ", key);

      let objId = loats[key]._id.toString();
      let old_userid = loats[key].userId.toString();

      if (old_userid && old_userid != null) {
        const queryText = `SELECT id FROM users WHERE objid = '${old_userid}'`;
        try {
          const queryRes = await pgConnect.query(queryText);
          userId = queryRes.rows[0].id;
          console.log("userId :: ", old_userid, userId);
        } catch (error) {
          console.log("error :: WHILE SEARCHING USERS");
          console.log(error);
        }
      }

      let old_partyid = loats[key].partyId.toString();
      if (old_partyid && old_partyid != null) {
        const queryText = `SELECT id FROM partys WHERE objid = '${old_partyid}'`;
        try {
          const queryRes = await pgConnect.query(queryText);
          partyId = queryRes.rows[0].id;
          console.log("partyId :: ", old_partyid, partyId);
        } catch (error) {
          console.log("error :: WHILE SEARCHING PARTYS");
          console.log(error);
        }
      }

      let l_cuttingtype = loats[key].cuttingType;
      let l_price = loats[key].loatPrice;
      let l_weight = loats[key].loatWeight;
      let l_month = loats[key].month;
      let l_year = loats[key].year;
      let l_numofdimonds = loats[key].numOfDimonds;
      let l_multiwithdiamonds = loats[key].multiWithDiamonds;

      let isActive = loats[key].isActive;
      let isDelete = loats[key].isDelete;

      let entryDate = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (loats[key].entryDate && loats[key].entryDate != null) {
        entryDate = new Date(loats[key].entryDate)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      let createdAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (loats[key].createdAt && loats[key].createdAt != null) {
        createdAt = new Date(loats[key].createdAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      let updatedAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (loats[key].updatedAt && loats[key].updatedAt != null) {
        updatedAt = new Date(loats[key].updatedAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      const queryText =
        "INSERT INTO loats(objId, userId, old_userid, old_partyid, partyId, l_cuttingtype, l_entrydate, l_price, l_weight, l_month, l_year, l_numofdimonds, l_multiwithdiamonds, isActive, isDelete, createdAt, updatedAt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id";

      try {
        const queryRes = await pgConnect.query(queryText, [
          objId,
          userId,
          old_userid,
          old_partyid,
          partyId,
          l_cuttingtype,
          entryDate,
          l_price,
          l_weight,
          l_month,
          l_year,
          l_numofdimonds,
          l_multiwithdiamonds,
          isActive,
          isDelete,
          createdAt,
          updatedAt,
        ]);
        resData.push(queryRes.rows[0].id);
      } catch (error) {
        console.log("error :: WHILE INSERTING");
        console.log(error);
      }
    }
    console.log("INSERTING :: DONE");
    return res.json(resData);
  }
};

const MigratePartyTable = async (req, res, next) => {
  console.log("== Migrate Party Type Table ==");
  let partys = [];
  let resData = [];
  let userId;

  // partys = await model.Party.find({});

  if (partys.length > 0) {
    console.log("INSERTING :: START", partys.length);

    for (const key in partys) {
      console.log("key :: ", key);

      let objId = partys[key]._id.toString();
      let old_userid = partys[key].userId.toString();

      if (old_userid && old_userid != null) {
        const queryText = `SELECT id FROM users WHERE objid = '${old_userid}'`;
        try {
          const queryRes = await pgConnect.query(queryText);
          userId = queryRes.rows[0].id;
          console.log("userId :: ", old_userid, userId);
        } catch (error) {
          console.log("error :: WHILE SEARCHING USERS");
          console.log(error);
        }
      }

      // Cutting Type Injecter
      // const types = partys[key].cuttingType;
      // if (types && types.length > 0) {
      //   for (const pKey in types) {
      //     console.log("pKey :: ", types[pKey]);
      //     const objId_cuttype = types[pKey]._id.toString();

      //     let c_name = types[pKey].cutType;
      //     let c_colorCode = types[pKey].colorCode || '';
      //     let c_multiWithDiamonds = types[pKey].multiWithDiamonds;
      //     let c_price = types[pKey].price;
      //     const queryText = "INSERT INTO cuttingTypes(objId, userId, old_userid, c_name, c_colorCode, c_multiWithDiamonds, c_price, isActive, isDelete, createdAt, updatedAt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";
      //     try {
      //       const queryRes = await pgConnect.query(queryText, [
      //         objId_cuttype,
      //         userId,
      //         old_userid,
      //         c_name,
      //         c_colorCode,
      //         c_multiWithDiamonds,
      //         c_price,

      //         isActive,
      //         isDelete,
      //         createdAt,
      //         updatedAt,
      //       ]);
      //       userId = queryRes.rows[0].id;
      //       console.log("userId :: ", old_userid, userId);
      //     } catch (error) {
      //       console.log("error :: WHILE INSERTING CUTTING TYPES");
      //       console.log(error);
      //     }
      //   }
      // }

      let p_name = partys[key].name;
      let p_billingName = partys[key].billingName;
      let p_mobile = partys[key].mobile;
      let p_address = "";
      let p_email = "";
      let p_openingBalance = partys[key].openingBalance;

      let isActive = partys[key].isActive;
      let isDelete = partys[key].isDelete;

      let createdAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (partys[key].createdAt && partys[key].createdAt != null) {
        createdAt = new Date(partys[key].createdAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      let updatedAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (partys[key].updatedAt && partys[key].updatedAt != null) {
        updatedAt = new Date(partys[key].updatedAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      const queryText =
        "INSERT INTO partys(objId, userId, old_userid, p_name, p_billingName, p_mobile, p_openingBalance, isActive, isDelete, createdAt, updatedAt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";

      try {
        const queryRes = await pgConnect.query(queryText, [
          objId,
          userId,
          old_userid,
          p_name,
          p_billingName,
          p_mobile,
          p_openingBalance,
          isActive,
          isDelete,
          createdAt,
          updatedAt,
        ]);
        resData.push(queryRes.rows[0].id);
      } catch (error) {
        console.log("error :: WHILE INSERTING");
        console.log(error);
      }
    }
    console.log("INSERTING :: DONE");
    return res.json(resData);
  }
};

const MigrateCuttingTypeTable = async (req, res, next) => {
  console.log("== Migrate Cutting Type Table ==");
  let cuttingTypes = [];
  let resData = [];
  let userId;

  // cuttingTypes = await model.CuttingType.find({});

  if (cuttingTypes.length > 0) {
    console.log("INSERTING :: START", cuttingTypes.length);

    for (const key in cuttingTypes) {
      let objId = cuttingTypes[key]._id.toString();
      let old_userid = cuttingTypes[key].userId.toString();

      if (old_userid && old_userid != null) {
        const queryText = `SELECT id FROM users WHERE objid = '${old_userid}'`;
        try {
          const queryRes = await pgConnect.query(queryText);
          userId = queryRes.rows[0].id;
          console.log("userId :: ", old_userid, userId);
        } catch (error) {
          console.log("error :: WHILE SEARCHING USERS");
          console.log(error);
        }
      }

      let c_name = cuttingTypes[key].cutType;
      let c_colorCode = cuttingTypes[key].colorCode;
      let c_multiWithDiamonds = cuttingTypes[key].multiWithDiamonds;
      let c_price = cuttingTypes[key].price;

      let isActive = cuttingTypes[key].isActive;
      let isDelete = cuttingTypes[key].isDelete;

      let createdAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (cuttingTypes[key].createdAt && cuttingTypes[key].createdAt != null) {
        createdAt = new Date(cuttingTypes[key].createdAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      let updatedAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (cuttingTypes[key].updatedAt && cuttingTypes[key].updatedAt != null) {
        updatedAt = new Date(cuttingTypes[key].updatedAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      const queryText =
        "INSERT INTO cuttingTypes(objId, userId, old_userid, c_name, c_colorCode, c_multiWithDiamonds, c_price, isActive, isDelete, createdAt, updatedAt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";

      try {
        const queryRes = await pgConnect.query(queryText, [
          objId,
          userId,
          old_userid,
          c_name,
          c_colorCode,
          c_multiWithDiamonds,
          c_price,
          isActive,
          isDelete,
          createdAt,
          updatedAt,
        ]);
        resData.push(queryRes.rows);
      } catch (error) {
        console.log("error :: WHILE INSERTING");
        console.log(error);
      }
    }
    console.log("INSERTING :: DONE");
    return res.json(resData);
  }
};

const MigrateUserTable = async (req, res, next) => {
  console.log("== Migrate User Table ==");

  let resData = [];
  let users = [];
  // users = await model.User.find({});

  if (users.length > 0) {
    console.log("INSERTING :: DONE", users.length);
    for (const key in users) {
      console.log("key -> ", key);

      let objId = users[key]._id.toString();
      let u_name = users[key].name;
      let u_billingName = users[key].name;
      let u_mobile = users[key].mobile;
      let u_address = "";
      let u_email = users[key].email;
      let u_role = users[key].role;
      let oldPassword = users[key].password;
      let password = users[key].mobile;

      let isActive = users[key].isActive;
      let isDelete = users[key].isDelete;

      let createdAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (users[key].createdAt && users[key].createdAt != null) {
        createdAt = new Date(users[key].createdAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      let updatedAt = new Date()
        .toString()
        .replace(" GMT+0530 (India Standard Time)", "");

      if (users[key].updatedAt && users[key].updatedAt != null) {
        updatedAt = new Date(users[key].updatedAt)
          .toString()
          .replace(" GMT+0530 (India Standard Time)", "");
      }

      const queryText =
        "INSERT INTO users(objId, u_name, u_billingName, u_mobile, u_address, u_email, u_role, oldPassword, password, isActive, isDelete, createdAt, updatedAt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id";

      try {
        const queryRes = await pgConnect.query(queryText, [
          objId,
          u_name,
          u_billingName,
          u_mobile,
          u_address,
          u_email,
          u_role,
          oldPassword,
          password,
          isActive,
          isDelete,
          createdAt,
          updatedAt,
        ]);
        resData.push(queryRes.rows);
      } catch (error) {
        console.log("error :: WHILE INSERTING");
        console.log(error);
      }
    }
    console.log("INSERTING :: DONE");
    return res.json(resData);
  }
};

export const MigrationController = {
  MigrateLoatTable,
};
