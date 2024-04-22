import fs from "fs"
import moment from "moment"
import path from "path"
import { v4 as uuid } from "uuid"

import { config } from "../configs/config.js"
import { initializeFirebase } from "../models/index.js"


const errorRes = (message,status = 0) => {
    const iRes = {
        statuscode: status,
        message,
    }
    return iRes
}

const successRes = (data, message = "Successfully Data Fetched!") => {
    const iRes = {
        statuscode: 1,
        message,
        data,
    }
    return iRes
}

const successMessage = (message) => {
    const iRes = {
        statuscode: 1,
        message,
    }
    return iRes
}

const errorMessage = (message) => {
    const iRes = {
        statuscode: 0,
        message,
    }
    return iRes
}



const moveFile = (file, userId, role = "TEMP") => {
    const userDirPath = path.join(
        config.FILE_STORE_PATH,
        role,
        userId.toString()
    )
    const currentPath = path.join(config.FILE_STORE_PATH, "TEMP", file)
    const destinationPath = path.join(
        config.FILE_STORE_PATH,
        role,
        userId.toString(),
        file
    )



    if (!fs.existsSync(userDirPath)) {

        fs.mkdir(
            path.join(config.FILE_STORE_PATH, role, userId.toString()),
            (err) => {
                if (err) {
                    throw err
                }
                fs.rename(currentPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove
                    }
                })
            }
        )
    } else {

        fs.rename(currentPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove
            }
        })
    }
}

// MENU Directory CREATE
const moveMenuFile = async (restaurentId, menuId, role = "MENU", file) => {
    const MenuDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    )
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file)
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    )
    
    //Check Directory Exist
    if (!fs.existsSync(MenuDirPath)) {
        //check first MENU Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A MENU directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove
                    }
                })
                
            }
        } else { //MENU Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove
                }
            })
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove
            }
        })
    }
}

// CATEGORY DIRECTORY CREATE
const moveCategoryFile = async (restaurentId, menuId, role = "CATEGORY", file) => {
    const CategoryDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    )
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file)
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    )
    
    //Check Directory Exist
    if (!fs.existsSync(CategoryDirPath)) {
        //check first CATEGORY Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A CATEGORY directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove
                    }
                })
                
            }
        } else { //CATEGORY Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove
                }
            })
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove
            }
        })
    }
}

// ITEM DIRECTORY CREATE
const moveItemFile = async (restaurentId, categoryId, role = "ITEM", file) => {
    const ItemDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    )
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file)
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    )
    
    //Check Directory Exist
    if (!fs.existsSync(ItemDirPath)) {
        //check first ITEM Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A ITEM Directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove
                    }
                })
                
            }
        } else { //ITEM Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove
                }
            })
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove
            }
        })
    }
}


// create Directory 
const makeDir = async (restaurentPath, oldDirName, newDirName, iD) => {
    if (iD) {
        await fs.mkdir(path.join(restaurentPath, oldDirName, newDirName, iD), (err) => { if (err) { throw err } })
    } else {
        await fs.mkdir(path.join(restaurentPath, oldDirName, newDirName), (err) => { if (err) { throw err } })
    }
}

const removeFile = (file, role = "TEMP", folder = "") => {
    // We have folder user id (update time)
    if (folder) {

        const folderId = folder.toString()
        fs.unlink(path.join(config.USER_FILE_STORE_PATH, folderId, file),
            (err) => {
                if (err) throw err
            }
        )
    } else {

        // not have folder user id (signup time)
        fs.unlink(path.join(config.FILE_STORE_PATH, role, file),
            (err) => {
                if (err) throw err
            })
    }
}

const removeMenuFile = (file, role = "MENU", folder = "") => {
    // We have folder restaurent id (add & update time)
    if (folder) {
        const folderId = folder.toString()
        fs.unlink(path.join(config.RESTAURENT_FILE_STORE_PATH, folderId, role, file),
            (err) => {
                if (err) throw err
            }
        )
    } else {
        // have && not have folder user id (add time)
        fs.unlink(path.join(config.FILE_STORE_PATH, "TEMP", file), (err) => {
            if (err) throw err
        })
    }
}

const removeCategoryFile = (file, role = "CATEGORY", folder = "") => {
    // We have folder restaurent id (add & update time)
    if (folder) {
        const folderId = folder.toString()
        fs.unlink(path.join(config.RESTAURENT_FILE_STORE_PATH, folderId, role, file),
            (err) => {
                if (err) throw err
            }
        )
    } else {
        // have && not have folder user id (add time)
        fs.unlink(path.join(config.FILE_STORE_PATH, "TEMP", file), (err) => {
            if (err) throw err
        })
    }
}

const removeItemFile = (file, role = "ITEM", folder = "") => {
    // We have folder restaurent id (add & update time)
    if (folder) {
        const folderId = folder.toString()
        fs.unlink(path.join(config.RESTAURENT_FILE_STORE_PATH, folderId, role, file),
            (err) => {
                if (err) throw err
            }
        )
    } else {
        // have && not have folder user id (add time)
        fs.unlink(path.join(config.FILE_STORE_PATH, "TEMP", file), (err) => {
            if (err) throw err
        })
    }
}

const getRandomNumber = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
}

const formatDate = (date) => {
  return `${moment(moment(date, 'DD-MM-YYYY')).format('YYYY-MM-DD')}T05:30:00.000+05:30`
}

const getMonth = (date) => {
  return moment(moment(date, 'DD-MM-YYYY')).month()
}

const getYear = (date) => {
  return moment(moment(date, 'DD-MM-YYYY')).year()
}

const getDay = (date) => {
  return moment(moment(date, 'DD-MM-YYYY')).day()
}

const createPaymentObject = (partyDetail) => {
    
    const paymentObject = {
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

    if (partyDetail && partyDetail.length > 0) {
        partyDetail.map((type) => {
            paymentObject.paymentDetails.push(
                { key: `Total Diamonds (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Total Weight (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Total Amount (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Diamond Wise Count (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Diamond Wise Weight (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Diamond Wise Amount (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Weight Wise Diamond (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Weight Wise Weight (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
                { key: `Weight Wise Amount (${type.cutType})`, value: 0, price:type.price, isMWDimond: type.multiWithDiamonds },
            )
        })
    }
    
    return paymentObject
}

const updloadFileToFirebase = async (filename) => {
    try {
        const bucket = await initializeFirebase()
        const metadata = {
        metadata: {
            // This line is very important. It's to create a download token.
            firebaseStorageDownloadTokens: uuid()
        },
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
        };
    
        // Uploads a local file to the bucket
        await bucket.upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: metadata,
        });

        console.log(`${filename} uploaded.`);

        fs.unlink(path.join(filename), (err) => {
            if (err) throw err
        })

        console.log(`${config.FIREBASE_IMAGE_URL}${filename.split("\\").pop()}?alt=media`);

        return `${config.FIREBASE_IMAGE_URL}${filename.split('\\').pop()}?alt=media`
    } catch(err) {
        console.log('err', err);
        throw err 
    }
}

const helper = {
    removeFile,
    moveFile,
    moveMenuFile,
    removeMenuFile,
    moveCategoryFile,
    removeCategoryFile,
    moveItemFile,
    removeItemFile,
    getRandomNumber,
    formatDate,
    getMonth,
    getYear,
    createPaymentObject,
    updloadFileToFirebase
}

export { errorRes, successRes, successMessage, errorMessage }
export default helper