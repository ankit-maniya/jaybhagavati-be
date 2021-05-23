import multer from "multer"
import path from "path"
import pify from "pify"
import { config } from "../configs/config"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.TEMP_FILE_STORE_PATH)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".").pop())
  },
})

// file type validation
const checkfiletype = (file, cb) => {
  const fileType = /jpeg|jpg|png|gif/
  const extType = fileType.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileType.test(file.mimetype)
  if (extType && mimeType) {
    return cb(null, true)
  } else {
    return cb(
      "Invalid filetype ! Please upload valid file like /jpeg|jpg|png|gif/",
      false
    )
  }
}

// init uploadStorage
export const uploadFileToStorage = pify(
  multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: async (req, file, cb) => {
      checkfiletype(file, cb)
    },
  }).fields([
    { name: "profile", maxCount: 1 }
  ])
)
